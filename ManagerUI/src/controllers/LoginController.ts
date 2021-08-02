import { BaseController } from "./BaseController";

export class LoginController extends BaseController {
  private getBreakElement() {
    return this.createElement('br');
  }
  public createView(): HTMLDivElement {

    const title = this.createElement("h2", "Please Login");
    const userName = this.createElement("label", "Username:");
    const userNameInput = this.createElement("input");
    const password = this.createElement("label", "Password:");
    
    const passwordInput = this.createElement("input");
    passwordInput.type = "Password";

    const loginButton = this.createElement("button", "Login");

    this.container.append(
      title,
      userName,
      userNameInput,
      this.getBreakElement(),
      password,
      passwordInput,
      this.getBreakElement(),
      loginButton
    );

    return this.container;
  }
}
