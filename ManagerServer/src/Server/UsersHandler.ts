import { IncomingMessage, ServerResponse } from "http";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
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
      case HTTP_METHODS.PUT:
        await this.handlePut();
        break;
      default:
        this.handleNotFound();
        break;
    }
  }

  async handleGet() {
    const operationAuthorized = await this.operationAuthorized(
      AccessRight.READ
    );
    if (operationAuthorized) {
      const parsedUrl = Utils.getUrlParameters(this.req.url);
      if (parsedUrl) {
        if (parsedUrl.query.id) {
          const user = await this.usersDBAccess.getUserById(String(parsedUrl.query.id)); // userId
          if (user) {
            this.respondJsonObject(HTTP_CODES.OK, user);
          } else {
            this.respondBadRequest("userId not present in request");
          }
        } else if (parsedUrl.query.name) {
          const users = await this.usersDBAccess.getUsersByName(String(parsedUrl.query.name));
          this.respondJsonObject(HTTP_CODES.OK, users);
        } else {
          this.respondBadRequest('userId and name not present in request');
        }
      }
    } else {
      this.respondUnauthorized("missing or invalid authentication");
    }
  }

  private async handlePut() {
    const operationAuthorised = await this.operationAuthorized(AccessRight.CREATE);
    if (operationAuthorised) {
      try {
        const user: User = await this.getRequestBody();
        await this.usersDBAccess.putUser(user);
        this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`);
      } catch (err) {
        this.respondBadRequest(err.message);
      }
    } else {
      this.respondUnauthorized("user is not authorised to make this PUT request");
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
