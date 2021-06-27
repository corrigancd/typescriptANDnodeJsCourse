import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Utils } from './Utils';

export class Server {

    // needs to be public because this function is called from Launcher.ts
    public createServer() {
        createServer(
            (req: IncomingMessage, res: ServerResponse) => {
                // The "?" below indicates that url may be defined or undefined
                console.log('got request from: ', req.url?.length)
                const basePath = Utils.getUrlBasePath(req.url);
                res.end();
            }
        ).listen(8080);
        console.log('server started');
    }

}
