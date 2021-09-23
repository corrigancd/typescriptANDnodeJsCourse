import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { countInstances } from "../Shared/ObjectsCounter";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Account, TokenGenerator } from "./Model";

@countInstances
export class LoginHandler extends BaseRequestHandler {
  private tokenGenerator: TokenGenerator;

  public constructor(
    tokenGenerator: TokenGenerator,
  ) {
    super({} as any, {} as any);
    this.tokenGenerator = tokenGenerator;
  }

  public async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    switch (req.method) {
      case HTTP_METHODS.POST:
        await this.handlePost();
        break;
      case HTTP_METHODS.OPTIONS:
        res.writeHead(HTTP_CODES.OK);
        break;
      default:
        this.handleNotFound();
        break;
    }
  }

  private async handlePost() {
    try {
      const body: Account = await this.getRequestBody();
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
}
