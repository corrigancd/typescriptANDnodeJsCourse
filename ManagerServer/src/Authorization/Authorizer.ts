import { Account, SessionToken, TokenGenerator } from "../Server/Model";

export class Authorizer implements TokenGenerator {
  async generateToken(account: Account): Promise<SessionToken | undefined> {
    if (account.username === 'john' ) {
      return {
        tokenId: 'some token Id'
      };

    } else {
      return undefined;
    }
  }
  
}
