import { LoginService } from "../services/LoginService";
import { BaseController } from "./BaseController";
import { LinkTextValue } from "./Decorators";

export class LoginController extends BaseController {
  private loginService = new LoginService();
  private getBreakElement() {
    return this.createElement("br");
  }
  private title = this.createElement("h2", "Please Login");
  private userName = this.createElement("label", "Username:");
  private userNameInput = this.createElement("input");
  private break1 = this.createElement("br");
  private password = this.createElement("label", "Password:");
  private passwordInput = this.createElement("input");
  private break2 = this.createElement("br");

  private errorLabel = this.createElement("label");
  private break3 = this.createElement("br");

  @LinkTextValue('errorLabel')
  private errorLabelText: string = "";

  private loginButton = this.createElement("button", "Login", async () => {
    if (this.userNameInput.value && this.passwordInput.value) {
      this.errorLabelText = '';
      const result = await this.loginService.login(
        this.userNameInput.value,
        this.passwordInput.value
      );

      if (result) {
        this.router.switchToDashboardView(result);
      } else {
        this.errorLabelText = "Wrong username or password!";
      }
    } else {
      this.errorLabelText = "Please fill in both fields!";
    }
  });

  public createView(): HTMLDivElement {
    this.passwordInput.type = "Password";
    this.errorLabel.style.color = "red";
    this.errorLabel.style.visibility = "hidden";
    this.errorLabel.id = 'errorLabel';

    return this.container;
  }
}
