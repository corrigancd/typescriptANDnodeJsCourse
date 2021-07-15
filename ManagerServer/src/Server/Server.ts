import { createServer, IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { LoginHandler } from "./LoginHandler";
import { UsersHandler } from "./UsersHandler";
import { Utils } from "./Utils";

export class Server {
  private authorizer: Authorizer = new Authorizer;

  // needs to be public because this function is called from Launcher.ts
  public createServer() {
    
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // The "?" below indicates that url may be defined or undefined
      console.log("got request from: ", req.url?.length);
      const basePath = Utils.getUrlBasePath(req.url);

      switch (basePath) {
        case "login":
          await new LoginHandler(req, res, this.authorizer).handleRequest();
          break;
          case "users": 
          await new UsersHandler(req, res).handleRequest();
        default:
          break;
      }

      res.end();
    }).listen(8080);
    console.log("server started");
  }
}
