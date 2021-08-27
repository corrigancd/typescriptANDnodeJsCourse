import { SessionToken } from "../models/AuthenticationModels";

export class LoginService {
  public async login(userName: string, password: string): Promise<SessionToken | undefined> {
    if (userName === 'user' && password === '123') {
      return {
        username: 'Some user',
      } as any
    } else {
      return undefined;
    }
  }
}
