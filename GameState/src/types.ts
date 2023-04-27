export type PlayerAction = {
    playerId: string;
    choice: Choice;
}

export enum Choice {
    Rock = 'rock',
    Paper = 'paper',
    Scissors = 'scissors'
}