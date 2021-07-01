import { Account, SessionToken, TokenGenerator } from "../Server/Model";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator {
  private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.userCredDBAccess.getUserCredential(
      account.username,
      account.password
    );

    if (resultAccount) {
      const token: SessionToken = {
        tokenId: this.generateRandomTokenId(),
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

  private generateExpirationTime = (): Date => {
    const hour = 60 * 60 * 10000;
    return new Date(Date.now() + hour);
  };

  private generateRandomTokenId = (): string => {
    return Math.random().toString(36).slice(2);
  };
}
