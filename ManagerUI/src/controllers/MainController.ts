import { BaseController } from './BaseController';

export class MainController extends BaseController {
  
  public createView(): HTMLDivElement {
    
    const title = this.createElement('h2', 'Welcome to our main page!');  
    const article = this.createElement('div', "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
    const button = this.createElement('button', 'Login', () => this.router.switchToLoginView());

    return this.container;
  }

}
