import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../Shared/Model";

export abstract class BaseRequestHandler {
  protected req: IncomingMessage;
  protected res: ServerResponse;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  abstract handleRequest(): Promise<void>;

  protected async handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write("not found");
  }

  protected async getRequestBody(): Promise<any> {
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
