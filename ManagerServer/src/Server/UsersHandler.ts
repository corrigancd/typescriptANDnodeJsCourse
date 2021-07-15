import { IncomingMessage, ServerResponse } from "http";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { Utils } from "./Utils";

export class UsersHandler extends BaseRequestHandler {
  private usersDBAccess: UsersDBAccess = new UsersDBAccess();

  public constructor(req: IncomingMessage, res: ServerResponse) {
    super(req, res);
    this.req = req;
    this.res = res;
  }

  async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet();
        break;
      default:
        this.handleNotFound();
        break;
    }
  }

  async handleGet() {
    const parsedUrl = Utils.getUrlParameters(this.req.url);
    if (parsedUrl) {
      const userId = parsedUrl.query.id;
      if (userId) {
        const user = await this.usersDBAccess.getUserById(String(userId));
        if (user) {
          this.respondJsonObject(HTTP_CODES.OK, user);
        } else {
          this.respondBadRequest('userId not present in request');
        }
      }
    }
  }

}
