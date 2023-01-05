import { User } from "./user.model";
import { SpentWords } from "./word.model";

export class Game {
  id: string;
  ownerId: string;
  gameStatus: GameStatus;
  teams: Team[];
  stagedPlayers: Player[];
  spentWords: SpentWords;
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
  roundId: string;
  timer: number;
  players: Player[];
  wordPool: string[];
  category: string;
}

export enum GameStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
