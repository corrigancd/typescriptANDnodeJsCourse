import { Server } from './Server/Server';

class Launcher {
    //instance variables
    private name: string;
    private server: Server;

    constructor() {
      this.server = new Server();
      this.name = 'bla bla bla'
    }

    public launchApp() {
        console.log('started app');
        this.server.createServer();
    }

}

const launcher = new Launcher();
launcher.launchApp();
