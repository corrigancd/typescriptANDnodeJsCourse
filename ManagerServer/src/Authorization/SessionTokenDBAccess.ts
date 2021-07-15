import Nedb from "nedb";
import { SessionToken } from "../Server/Model";

export class SessionTokenDBAccess {
  private nedb: Nedb;

  public constructor() {
    this.nedb = new Nedb("database/Tokens.db");
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

  public async getSessionToken(
    tokenId: string
  ): Promise<SessionToken | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find(
        { tokenId },
        (err: Error | null, tokens: SessionToken[]) => {
          if (err) {
            reject(err);
          } else {
            if (tokens.length === 0) {
              resolve(undefined);
            } else {
              resolve(tokens[0]);
            }
          }
        }
      );
    });
  }
}
