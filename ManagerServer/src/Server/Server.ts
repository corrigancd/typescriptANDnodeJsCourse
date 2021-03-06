import { createServer, IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { Monitor } from "../Shared/ObjectsCounter";
import { LoginHandler } from "./LoginHandler";
import { UsersHandler } from "./UsersHandler";
import { Utils } from "./Utils";

const port: number = 8080;

export class Server {
  private authorizer: Authorizer = new Authorizer();
  private loginHandler: LoginHandler = new LoginHandler(this.authorizer);
  private usersHandler: UsersHandler = new UsersHandler(this.authorizer);

  // needs to be public because this function is called from Launcher.ts
  public createServer() {
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // The "?" below indicates that url may be defined or undefined
      console.log("got request from: ", req.url?.length);
      this.addCorsHeaders(res);

      const basePath = Utils.getUrlBasePath(req.url);

      switch (basePath) {
        case "systemInfo":
          res.write(Monitor.printInstances());
        case "login":
          this.loginHandler.setRequest(req);
          this.loginHandler.setResponse(res);
          await this.loginHandler.handleRequest(req, res);
          break;
        case "users":
          this.usersHandler.setRequest(req);
          this.usersHandler.setResponse(res);
          await this.usersHandler.handleRequest(req, res);
        default:
          break;
      }

      res.end();
    }).listen(port);
    console.log(`server started on port ${8080}`);
  }

  private addCorsHeaders(res: ServerResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
  }
}
