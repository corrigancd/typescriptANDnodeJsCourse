import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { Account, Handler, TokenGenerator } from "./Model";

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
    switch (this.req.method) {
      case HTTP_METHODS.POST:
        await this.handlePost();
        break;
      default:
        this.handleNotFound();
        break;
    }
  }

  private async handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write("not found");
  }

  private async handlePost() {
    try {
      const body = await this.getRequestBody();
      const sessionToken = await this.tokenGenerator.generateToken(body);
      if (sessionToken) {
        // this is how a valid response should look from our database
        this.res.statusCode = HTTP_CODES.CREATED;
        this.res.writeHead(HTTP_CODES.CREATED, {
          "Content-Type": "application",
        });
        this.res.write(JSON.stringify(sessionToken));
      } else {
        this.res.write("wrong credentials");
      }
    } catch (err) {
      this.res.statusCode = HTTP_CODES.NOT_FOUND;
      this.res.write("wrong username or password");
    }
  }

  private async getRequestBody(): Promise<Account> {
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
