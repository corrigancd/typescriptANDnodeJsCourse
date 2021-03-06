import { IncomingMessage, ServerResponse } from "http";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
import { Utils } from "./Utils";
import { TokenValidator } from "./Model";
import { countInstances } from "../Shared/ObjectsCounter";

@countInstances
export class UsersHandler extends BaseRequestHandler {
  private usersDBAccess: UsersDBAccess = new UsersDBAccess();
  private tokenValidator: TokenValidator;

  public constructor(
    tokenValidator: TokenValidator
  ) {
    super({} as any, {} as any);
    this.tokenValidator = tokenValidator;
  }

  async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    switch (req.method) {
      case HTTP_METHODS.OPTIONS:
        res.writeHead(HTTP_CODES.OK);
        break;
      case HTTP_METHODS.GET:
        await this.handleGet();
        break;
      case HTTP_METHODS.PUT:
        await this.handlePut();
        break;
      case HTTP_METHODS.DELETE:
        await this.handleDelete();
        break;
      default:
        this.handleNotFound();
        break;
    }
  }

  private async handleDelete() {
    const operationAuthorized = await this.operationAuthorized(AccessRight.DELETE);
    if (operationAuthorized) {
      const parsedUrl = Utils.getUrlParameters(this.req.url);
      if (parsedUrl) {
        if (parsedUrl.query.id) {
          const deleteResult = await this.usersDBAccess.deleteUserById(String(parsedUrl.query.id));
          if (deleteResult) {
            this.respondText(HTTP_CODES.OK, `user ${parsedUrl.query.id} deleted`)
          } else {
            this.respondText(HTTP_CODES.NOT_FOUND, `user ${parsedUrl.query.id} was not deleted`)
          }
        } else {
          this.respondBadRequest('missing id in the request');
        }
      }
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
          const user = await this.usersDBAccess.getUserById(
            String(parsedUrl.query.id)
          ); // userId
          if (user) {
            this.respondJsonObject(HTTP_CODES.OK, user);
          } else {
            this.respondBadRequest("userId not present in request");
          }
        } else if (parsedUrl.query.name) {
          const users = await this.usersDBAccess.getUsersByName(
            String(parsedUrl.query.name)
          );
          this.respondJsonObject(HTTP_CODES.OK, users);
        } else {
          this.respondBadRequest("userId and name not present in request");
        }
      }
    } else {
      this.respondUnauthorized("missing or invalid authentication");
    }
  }

  private async handlePut() {
    const operationAuthorised = await this.operationAuthorized(
      AccessRight.CREATE
    );
    if (operationAuthorised) {
      try {
        const user: User = await this.getRequestBody();
        await this.usersDBAccess.putUser(user);
        this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`);
      } catch (err: any) {
        this.respondBadRequest(err.message);
      }
    } else {
      this.respondUnauthorized(
        "user is not authorised to make this PUT request"
      );
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
