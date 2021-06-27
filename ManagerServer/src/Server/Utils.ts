import { parse } from "url";

export class Utils {
  //                     url will be string: function will return a string
  public static getUrlBasePath(url: string | undefined): string {
    if (url) {
      const parsedUrl = parse(url);
      // exclamation mark means that pathname should be valid
      // https://stackoverflow.com/questions/42273853/in-typescript-what-is-the-exclamation-mark-bang-operator-when-dereferenci
      return parsedUrl.pathname!.split('/')[1];
    }
    return '';
  }
}
