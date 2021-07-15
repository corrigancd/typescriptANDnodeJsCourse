import { User } from "../Shared/Model";
import Nedb from "nedb";

export class UsersDBAccess {
  private nedb: Nedb;

  public constructor() {
    this.nedb = new Nedb("database/Users.db");
    this.nedb.loadDatabase();
  }

  public async putUser(user: User) {
    return new Promise<void>((resolve, reject) => {
      this.nedb.insert(user, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async getUser(
    username: string,
    password: string
  ): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find(
        { username, password },
        (err: Error | null, results: User[]) => {
          if (err) {
            reject(err);
          } else {
            if (results.length === 0) {
              resolve(undefined);
            } else {
              resolve(results[0]);
            }
          }
        }
      );
    });
  }
}
