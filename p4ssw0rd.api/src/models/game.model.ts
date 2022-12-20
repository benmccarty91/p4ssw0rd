export class Game {
  id: string;
  ownerId: string;
  gameStatus: GameStatus;
}

export enum GameStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
