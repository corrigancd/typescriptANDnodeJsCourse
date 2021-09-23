import { AccessRight, SessionToken } from "../models/AuthenticationModels";
import { User } from "../models/DataModels";
import { DataService } from "../services/DataService";
import { BaseController } from "./BaseController";

export class DashboardController extends BaseController {
  private sessionToken: SessionToken | undefined;
  private searchArea: HTMLInputElement | undefined;
  private searchResultArea: HTMLDivElement | undefined;
  private dataService: DataService = new DataService();
  private selectedUser: User | undefined;
  private selectedLabel: HTMLLabelElement | undefined;

  public setSessionToken(sessionToken: SessionToken) {
    this.sessionToken = sessionToken;
  }

  public createView(): HTMLDivElement {
    const title = this.createElement("h2", "Dashboard controller");
    if (this.sessionToken) {
      this.createElement("label", `Welcome ${this.sessionToken.username}`);
      this.insertBreak();
      this.generateButtons();
    } else {
      this.createElement("label", "Please go to the public parts of this app!");
    }
    return this.container;
  }

  private generateButtons(): void {
    if (this.sessionToken) {
      this.sessionToken.accessRights.forEach((right) => {
        this.createElement("button", AccessRight[right], async () => {
          await this.triggerAction(right);
        });
      });
    }
    if (this.sessionToken?.accessRights.includes(AccessRight.READ)) {
      this.insertBreak();
      this.createElement("label", "search: ");
      this.searchArea = this.createElement("input");
      this.searchResultArea = this.createElement("div");
    }
  }
  private async triggerAction(right: AccessRight) {
    const users = await this.dataService.getUsers(
      this.sessionToken!.tokenId,
      this.searchArea!.value
    );
    switch (right) {
      case AccessRight.READ:
        for (const user of users) {
          this.selectedLabel = this.createElement(
            "label",
            JSON.stringify(user)
          );
          this.selectedLabel.onclick = () => {
            this.selectedLabel!.classList.toggle("selectedLabel");
            this.selectedUser = user;
          };
          this.searchResultArea!.append(this.selectedLabel);
          this.searchResultArea!.append(document.createElement("br"));
        }
        break;
      case AccessRight.UPDATE:
        break;
      case AccessRight.DELETE:
        if (this.selectedUser) {
          await this.dataService.deleteUser(
            this.sessionToken!.tokenId,
            this.selectedUser
          );
          this.selectedLabel!.innerHTML = "";
        }
        break;
      default:
    }
  }
}
