import { Injectable, Scope } from "@nestjs/common";
import { UserRepository } from "src/repositories/user.repository";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private _userId: string;
  constructor(
    private userRepository: UserRepository,
  ) {
    this._userId = "";
  }

  public set userId(id: string) {
    this._userId = id;
  }

  public get userId() {
    return this._userId;
  }
}
