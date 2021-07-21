import {
  Account,
  SessionToken,
  TokenGenerator,
  TokenRights,
  TokenState,
  TokenValidator,
} from "../Server/Model";
import { Utils } from "../Server/Utils";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator, TokenValidator {
  private userCredDBAccess: UserCredentialsDBAccess =
    new UserCredentialsDBAccess();
  private sessionTokenDBAccess: SessionTokenDBAccess =
    new SessionTokenDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.userCredDBAccess.getUserCredential(
      account.username,
      account.password
    );

    if (resultAccount) {
      const token: SessionToken = {
        tokenId: Utils.generateRandomId(),
        username: resultAccount.username,
        valid: true,
        expirationTime: this.generateExpirationTime(),
        accessRights: resultAccount.accessRights,
      };

      await this.sessionTokenDBAccess.storeSessionToken(token);
      return token;
    } else {
      return undefined;
    }
  }

  public async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.sessionTokenDBAccess.getSessionToken(tokenId);
    if (!token || !token.valid) {
      return {
        accessRights: [],
        state: TokenState.INVALID,
      };
    } else if (token.expirationTime < new Date()) {
      return {
        accessRights: [],
        state: TokenState.EXPIRED,
      };
    }
      return {
        accessRights: token.accessRights,
        state: TokenState.VALID,
      };
  }

  private generateExpirationTime = (): Date => {
    const hour = 60 * 60 * 10000;
    return new Date(Date.now() + hour);
  };
}
