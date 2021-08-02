import { LoginController } from "./controllers/LoginController";
import { MainController } from "./controllers/MainController";

export class Router {
  private mainElement = document.getElementById("main-container");
  public handleRequest() {
    console.log("handling request for route", this.getRoute());

    switch (this.getRoute()) {
      case "/login":
        if (this.mainElement) {
          this.mainElement.innerHTML = "";
          const loginController: LoginController = new LoginController();
          this.mainElement.append(loginController.createView());
        }
        break;
      default:
        if (this.mainElement) {
          const mainController: MainController = new MainController();
          this.mainElement.append(mainController.createView());
        }
        break;
    }
  }

  private getRoute(): string {
    return window.location.pathname;
  }
}
