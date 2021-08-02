export abstract class BaseController {
  public abstract createView(): HTMLDivElement;
  protected container = this.createElement("div");

  // we don't have to import HTMLElementTagNameMap because they are
  // already declared in the tsconfig.json, i.e. in the 'DOM' library
  /*
   * function creates an element of passed type and will set the text to display
   **/
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    elementType: K,
    innerText?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(elementType);
    if (innerText) {
      element.innerText = innerText;
    }
    return element;
  }
}
