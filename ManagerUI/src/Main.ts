import { Router } from './Router';

export class Main {
  private router: Router;

  public constructor() {
    console.log('Constructed new instance of the program');
    this.router = new Router();
  }

  public launchApp(): void {
    this.router.handleRequest();
  }
}

new Main().launchApp();
