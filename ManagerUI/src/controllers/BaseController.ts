import { Router } from "../Router";

export abstract class BaseController {
  protected container: HTMLDivElement = document.createElement("div");
  protected router: Router;

  public constructor(router: Router) {
    this.router = router;
  }

  public abstract createView(): HTMLDivElement;

  // we don't have to import HTMLElementTagNameMap because they are
  // already declared in the tsconfig.json, i.e. in the 'DOM' library
  /*
   * function creates an element of passed type and will set the text to display
   **/
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    elementType: K,
    innerText?: string,
    action?: any
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(elementType);
    if (innerText) {
      element.innerText = innerText;
    }
    if (action) {
      element.onclick = action;
    }

    this.container.append(element);
    return element;
  }
   
  protected insertBreak() {
    this.createElement("br");
  }
}
