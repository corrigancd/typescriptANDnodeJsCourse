import { IncomingMessage, ServerResponse } from "http";
import { Account, Handler, TokenGenerator } from "./Model";
import { Utils } from "./Utils";

export class LoginHandler implements Handler {
  private req: IncomingMessage;
  private res: ServerResponse;
  private tokenGenerator: TokenGenerator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenGenerator: TokenGenerator
  ) {
    this.req = req;
    this.res = res;
    this.tokenGenerator = tokenGenerator;
  }

  public async handleRequest(): Promise<void> {
    const body = await this.getRequestBody();
    const sessionToken = await this.tokenGenerator.generateToken(body);
    if (sessionToken) {
      this.res.write("valid credentials");
    } else {
      this.res.write("wrong credentials");
    }
  }

  public async getRequestBody(): Promise<Account> {
    return await new Promise((resolve, reject) => {
      let body = "";
      this.req.on("data", (data: string) => {
        body += data; // means data is added to end of body
      });

      // 2 event listeners that come out of the box on the
      // IncomingMessage property of the node http service
      this.req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
      this.req.on("error", (error: any) => reject(error));
    });
  }
}
