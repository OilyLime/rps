import { v4 as uuidv4 } from 'uuid';
import { Choice, PlayerAction } from "./types";

interface Player {
	websocket: WebSocket;
	id: string;
	wins: number;
}

interface Round {
	number: number;
	time: number;
	choices: Map<string, string>
	winner?: string;
}

type Message = Message.RoundComplete | Message.Healthcheck;

namespace Message {
	export type RoundComplete = {
		type: 'round';
		data: Round;
	}

	export type RoundOngoing = {
		type: 'choice';
		data: {
			playerId: string;
		}
	}

	export type Healthcheck = {
		type: 'healthcheck';
	}
}

// every 10 seconds
const healthCheckInterval = 10e3;

export class GameState {
	id: string;
	players: Map<string, Player>;
	rounds: Array<Round>;
	currentRound: number;
	storage: DurableObjectStorage;
	dolocation: string;

	constructor(state: DurableObjectState) {
		this.id = state.id.toString()
		this.players = new Map();
		this.rounds = new Array();
		this.currentRound = 0;
		this.rounds.push({
			number: 0,
			time: Date.now(),
			choices: new Map<string, string>()
		})
		this.storage = state.storage;
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
			const player = await this.handleWebSocketSession(server, cf as any);

			// Now we return the other end of the pair to the client.
			return new Response(null, { status: 101, webSocket: client });
		}

		return new Response(this.id);
	}

	resolveRound(): Round {
		const [a, b] = this.players;
		const round = this.rounds[this.currentRound];
		if ((round.choices.get(a[0]) === Choice.Rock && round.choices.get(b[0]) === Choice.Scissors) ||
			(round.choices.get(a[0]) === Choice.Paper && round.choices.get(b[0]) === Choice.Rock) ||
			(round.choices.get(a[0]) === Choice.Scissors && round.choices.get(b[0]) === Choice.Paper)) {
			round.winner = a[0]
		} else {
			round.winner = b[0]
		}
		this.rounds[this.currentRound] = round
		this.currentRound++
		this.rounds.push({
			number: this.currentRound,
			time: Date.now(),
			choices: new Map<string, string>()
		})
		return round
	}

	async handleWebSocketSession(webSocket: WebSocket, metadata: IncomingRequestCfProperties): Promise<Player | undefined> {
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
				let round = JSON.parse(msg.data.toString()) as PlayerAction;

				// TODO(maybe): Send an ack?
				// TODO(maybe): Lock state?
				// TODO(maybe): Prevent player some setting choice twice?
				this.rounds[this.currentRound].choices.set(playerId, round.choice)
				const outbound: Message.RoundOngoing = { type: 'choice', data: { playerId } }
				return this.broadcast(JSON.stringify(outbound))
			} catch (err: unknown) {
				// Report any exceptions directly back to the client. As with our handleErrors() this
				// probably isn't what you'd want to do in production, but it's convenient when testing.
				if (err instanceof Error) {
					webSocket.send(JSON.stringify({ error: err.stack }));
				} else {
					// TODO: Better message
					webSocket.send('something went wrong')
				}
			}
		});

		let closeOrErrorHandler = () => {
			console.log('player', playerId);
		};
		webSocket.addEventListener('close', closeOrErrorHandler);
		webSocket.addEventListener('error', closeOrErrorHandler);

		return this.players.get(playerId)
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
		if (this.rounds[this.currentRound].choices.size == 2) {
			const round = this.resolveRound()
			const msg: Message.RoundComplete = {
				type: 'round',
				data: round
			}
			this.broadcast(JSON.stringify([msg]));
		} else {
			const msg = { type: 'healthcheck' };
			this.broadcast(JSON.stringify([msg]));
		}

		if (this.players.size) this.scheduleNextAlarm(this.storage);
	}
}

export default {
	fetch() {
		return new Response('This Worker creates the GameState Durable Object.');
	}
}