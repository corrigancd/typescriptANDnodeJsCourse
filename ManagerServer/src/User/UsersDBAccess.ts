import { User } from "../Shared/Model";
import Nedb from "nedb";
import { Utils } from "../Server/Utils";

export class UsersDBAccess {
  private nedb: Nedb;

  public constructor() {
    this.nedb = new Nedb("database/Users.db");
    this.nedb.loadDatabase();
  }

  public async putUser(user: User) {
    if (!user.id) {
      user.id = Utils.generateRandomId();
    };
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

  public async getUserById(userId: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id: userId }, (err: Error | null, results: User[]) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(undefined);
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  }
}
