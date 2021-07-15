import { IncomingMessage, ServerResponse } from "http";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { AccessRight, HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { Utils } from "./Utils";
import { TokenValidator } from "./Model";

export class UsersHandler extends BaseRequestHandler {
  private usersDBAccess: UsersDBAccess = new UsersDBAccess();
  private tokenValidator: TokenValidator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenValidator: TokenValidator
  ) {
    super(req, res);
    this.req = req;
    this.res = res;
    this.tokenValidator = tokenValidator;
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
    const operationAuthorized = await this.operationAuthorized(AccessRight.READ);
    if (operationAuthorized) {
    const parsedUrl = Utils.getUrlParameters(this.req.url);
    if (parsedUrl) {
      const userId = parsedUrl.query.id;
      if (userId) {
        const user = await this.usersDBAccess.getUserById(String(userId));
        if (user) {
          this.respondJsonObject(HTTP_CODES.OK, user);
        } else {
          this.respondBadRequest("userId not present in request");
        }
      }
    }
    } else {
      this.responedUnauthorized('missing or invalid authentication');
    }
  }

  public async operationAuthorized(operation: AccessRight) {
    const tokenId = this.req.headers.authorization;
    if (tokenId) { 
      const tokenRights = await this.tokenValidator.validateToken(tokenId);
      if (tokenRights.accessRights.includes(operation)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

}
