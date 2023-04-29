import { v4 as uuidv4 } from 'uuid';
import { Choice, Player, BaseRound, Round, WhoAmI, IncomingEvent } from "./types";

// every 10 seconds
const healthCheckInterval = 10e3;

export class GameState {
	id: string;
	players: Map<string, Player>;
	rounds: Array<BaseRound | Round>;
	storage: DurableObjectStorage;
	dolocation: string;

	constructor(state: DurableObjectState) {
		this.id = state.id.toString()
		this.players = new Map();
		this.rounds = new Array();
		this.storage = state.storage;
		this.storage.put('currentRound', {
			number: 0,
			time: Date.now(),
			choices: new Map<string, string>()
		})
		this.dolocation = '';

		this.scheduleNextAlarm(this.storage);
		this.getDurableObjectLocation();
	}

	async fetch(request: Request): Promise<Response> {
		const { headers, cf } = request;

		// pass the request to Durable Object for any WebSocket connection
		if (headers.get('upgrade') === 'websocket' && cf !== undefined) {
			if (this.players.size > 1) {
				return new Response('Game is FULL!', { status: 403 })
			}

			// To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
			// i.e. two WebSockets that talk to each other), we return one end of the pair in the
			// response, and we operate on the other end. Note that this API is not part of the
			// Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
			// any way to act as a WebSocket server today.
			let pair = new WebSocketPair();
			const [client, server] = Object.values(pair);

			// We're going to take pair[1] as our end, and return pair[0] to the client.
			await this.handleWebSocketSession(server, cf as any);
			console.log('websocket established')
			// Now we return the other end of the pair to the client.
			return new Response(null, { status: 101, webSocket: client });
		}

		// TODO Return the current game state on non WS requests? Players, Rounds, etc.
		return new Response(this.id);
	}

	async resolveRound(): Promise<Round> {
		const [a, b] = this.players;
		const round = await this.storage.get('currentRound') as Round
		if ((round.choices.get(a[0]) === Choice.Rock && round.choices.get(b[0]) === Choice.Scissors) ||
			(round.choices.get(a[0]) === Choice.Paper && round.choices.get(b[0]) === Choice.Rock) ||
			(round.choices.get(a[0]) === Choice.Scissors && round.choices.get(b[0]) === Choice.Paper)) {
			round.winner = a[0]
		} else {
			round.winner = b[0]
		}
		this.players.get(round.winner).wins = this.players.get(round.winner).wins + 1

		this.rounds.push(round)
		await this.storage.put('currentRound', {
			number: round.number + 1,
			time: Date.now(),
			choices: new Map<string, string>()
		})
		console.log('resolveRound', round)
		return round
	}

	async handleWebSocketSession(webSocket: WebSocket, metadata: IncomingRequestCfProperties): Promise<void> {
		// Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
		// WebSocket in JavaScript, not sending it elsewhere.
		webSocket.accept();

		// Create our session and add it to the users map.
		const playerId = uuidv4();
		this.players.set(playerId, {
			id: playerId,
			websocket: webSocket,
			wins: 0,
		});

		webSocket.addEventListener('message', async msg => {
			try {
				const incomingEvent = JSON.parse(msg.data.toString()) as IncomingEvent;
				switch (incomingEvent.type) {
					case 'whoami':
						webSocket.send(JSON.stringify({ type: 'whoami', time: Date.now(), data: {playerId} }))
						break;
					case 'choice':
						// TODO move to separate function
						// TODO(maybe): Lock state?
						// TODO(maybe): Prevent player some setting choice twice?
						console.log('choice', playerId, incomingEvent)
						const currentRound = await this.storage.get('currentRound') as Round
						currentRound.choices.set(playerId, incomingEvent.data.choice)
						await this.storage.put('currentRound', currentRound)
						if (currentRound.choices.size == 2) {
							const resolved = await this.resolveRound()
							this.broadcast(JSON.stringify({type: 'result', time: Date.now(), data: {
								number: resolved.number, 
								time: resolved.time,
								choices: Array.from(resolved.choices.entries()),
								winner: resolved.winner
							}}))
						}
					default:
						break;
				}
			} catch (err: unknown) {
				// Report any exceptions directly back to the client. As with our handleErrors() this
				// probably isn't what you'd want to do in production, but it's convenient when testing.
				console.log('msg error!!')
				if (err instanceof Error) {
					webSocket.send(JSON.stringify({ error: err.stack }));
				} else {
					// TODO: Better message
					webSocket.send('something went wrong')
				}
			}
		});

		let closeOrErrorHandler = () => {
			console.log('player websocket closed', playerId);
			this.players.delete(playerId);
		};
		webSocket.addEventListener('close', closeOrErrorHandler);
		webSocket.addEventListener('error', closeOrErrorHandler);
	}

	// broadcast() broadcasts a message to all clients.
	broadcast(message: string) {
		// Iterate over all the sessions sending them messages.
		this.players.forEach((player) => {
			try {
				player.websocket.send(message);
			} catch (err) {
				console.log(`broadcast error: ${player}`);
			}
		});
	}

	async getDurableObjectLocation() {
		const res = await fetch('https://workers.cloudflare.com/cf.json');
		const json = (await res.json()) as IncomingRequestCfProperties;
		this.dolocation = `${json.city} (${json.country})`;
	}

	scheduleNextAlarm(storage: DurableObjectStorage) {
		try {
			const alarmTime = Date.now() + healthCheckInterval;
			storage.setAlarm(alarmTime);
		} catch {
			console.log('Durable Objects Alarms not supported in Miniflare (--local mode) yet.');
		}
	}

	alarm() {
		const msg = { type: 'healthcheck' };
		this.broadcast(JSON.stringify([msg]));

		if (this.players.size) this.scheduleNextAlarm(this.storage);
	}
}

export default {
	fetch() {
		return new Response('This Worker creates the GameState Durable Object.');
	}
}