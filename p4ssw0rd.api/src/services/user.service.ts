import { Injectable, Scope } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { User } from "src/models/user.model";
import { UserRepository } from "../repositories/user.repository";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private _userId: string;
  constructor(private userRepository: UserRepository) {
    this._userId = "";
  }

  public set userId(id: string) {
    this._userId = id;
  }

  public get userId() {
    return this._userId;
  }

  public registerUser(): Observable<boolean> {
    const user: User = {
      userId: this.userId,
    };
    return from(this.userRepository.saveUser(user));
  }

  public getUser(): Observable<User> {
    return from(this.userRepository.getUser(this.userId));
  }

  public saveUser(user: User): Observable<boolean> {
    return from(this.userRepository.saveUser(user));
  }
}
