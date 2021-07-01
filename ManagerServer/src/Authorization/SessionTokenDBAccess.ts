
import Nedb from "nedb";
import { SessionToken } from '../Server/Model';

export class SessionTokenDBAccess {

  private nedb: Nedb;

  public constructor() {
    this.nedb = new Nedb('database/Tokens.db');
    this.nedb.loadDatabase();
  }

  public async storeSessionToken(token: SessionToken): Promise<void> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(token, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // public async getSessionToken(username: string, password: string): Promise<UserCredentials | undefined>  {
  //   return new Promise((resolve, reject) => {
  //     this.nedb.find({username, password}, (err: Error | null, results: UserCredentials[]) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         if (results.length === 0) {
  //           resolve(undefined);
  //         } else {
  //          resolve(results[0]);
  //         }
  //       }
  //     });
  //   });
  // }
}
