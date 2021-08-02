import { BaseController } from "./BaseController";

export class LoginController extends BaseController {
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

  private resetErrorLabel() {
    this.errorLabel.innerText = "Please fill in both fields!";
    this.errorLabel.style.visibility = "red";
    this.errorLabel.style.visibility = "hidden";
  }

  private showErrorLabel(errorMessage: string) {
    this.errorLabel.innerText = errorMessage;
    this.errorLabel.style.visibility = "visible";
  }

  private loginButton = this.createElement("button", "Login", () => {
    if (this.userNameInput.value && this.passwordInput.value) {
      this.resetErrorLabel();
    } else {
      this.showErrorLabel("Please fill in both fields!");
    }
  });

  public createView(): HTMLDivElement {
    this.passwordInput.type = "Password";
    this.errorLabel.style.color = "red";
    this.errorLabel.style.visibility = "hidden";

    return this.container;
  }
}