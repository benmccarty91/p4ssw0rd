import { User } from "./user.model";

export class Game {
  id: string;
  ownerId: string;
  gameStatus: GameStatus;
  rounds: Round[];
  teams: Team[];
  currentRound?: number; //index of rounds array
  winningTeam?: number; //index of teams array
  stagedPlayers: Player[];
}

export class Player {
  userId: string;
  name?: string;
  photoUrl?: string;
}

export const playerFromUser = (user: User): Player => ({
  userId: user.userId,
  name: user.name,
  photoUrl: user.photoUrl,
});

export class Team {
  players: Player[];
  score: number;
}

export class Round {
  timer: number;
  startingPlayer: string;
}

export enum GameStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
