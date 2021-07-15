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
    console.log(parsedUrl.query.id, this.req.url);
    const a = '5';
  }

}
