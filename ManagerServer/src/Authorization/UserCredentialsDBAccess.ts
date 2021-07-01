import { UserCredentials } from "../Shared/Model"
import Nedb from "nedb";

export class UserCredentialsDBAccess {

  private nedb: Nedb;

  public constructor() {
    this.nedb = new Nedb('database/UserCredentials.db');
    this.nedb.loadDatabase();
  }

  public async putUserCredential(userCredentials: UserCredentials): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(userCredentials, (err: Error | null, userCredential: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(userCredential);
        }
      });
    });
  }

  public async getUserCredential(username: string, password: string): Promise<UserCredentials | undefined>  {
    return new Promise((resolve, reject) => {
      this.nedb.find({username, password}, (err: Error | null, results: UserCredentials[]) => {
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
