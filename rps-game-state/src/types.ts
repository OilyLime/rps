export enum Choice {
	Rock = 'rock',
	Paper = 'paper',
	Scissors = 'scissors'
}

export interface Player {
	websocket: WebSocket;
	id: string;
	wins: number;
}

export interface BaseRound {
	number: number;
	time: number;
	choices: Map<string, string>
}

export interface Round extends BaseRound {
	winner: string;
}

export interface BaseEvent<T extends string, D> {
	type: T;
	time: number;
	data: D;
}

export type WhoAmI = BaseEvent<'whoami', { playerId: string }>

export type PlayerChoice = BaseEvent<'choice', { choice: Choice }>

export type Healthcheck = BaseEvent<'healthcheck', null>

export type Result = BaseEvent<'result', { round: { number: number; time: number; choices: Array<[string, string]>; winner: string } }>

export type IncomingEvent = WhoAmI | PlayerChoice;

export type OutgoingEvent = WhoAmI | Healthcheck | Result;