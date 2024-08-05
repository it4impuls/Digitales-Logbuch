import { Injectable } from '@angular/core';
import { CookieType } from '../interfaces';

@Injectable({
  providedIn: "root",
})
export class CookieService {
  private parameterMap: { [name: string]: string } = {};
  private readonly expirationDate: string;

  // we save the domain to avoid that for every path a different cookie is used
  private readonly domain: string;

  constructor() {
    this.expirationDate = this.getCookieExpiration();
    this.domain = this.getDomain();

    if (document.cookie) {
      const paramList = document.cookie.split(";");
      paramList.forEach((parameter) => {
        const values = parameter.trim().split("=");
        // console.log(paramList);
        this.addToCookieWithName(values[0].trim(), values[1].trim()); // there is no reverse conversion for enum
      });
    }
  }

  addToCookieWithName(parameter: string, value: string): void {
    this.parameterMap[parameter] = value;
  }

  addToCookie(parameter: CookieType, value: string, optionals:string[] = []): void {
    this.parameterMap[parameter] = value;
    document.cookie = `${parameter}=${value}; ${this.expirationDate}; ${this.domain}; ${optionals.join(";")};`;
    this.refreshCookie();
  }

  getValue(parameter: CookieType): string | undefined {
    if (this.parameterMap.hasOwnProperty(parameter)) {
      return this.parameterMap[parameter];
    }

    return undefined;
  }

  removeFromCookie(parameter: CookieType): void {
    this.parameterMap[parameter] = "";
    this.refreshCookie();
  }

  refreshCookie(): void {
    let cookieString = "";
    Object.keys(this.parameterMap).forEach((field) => {
      
      if (this.parameterMap[field]) {
        cookieString += field + "=" + this.parameterMap[field] + ";";
      }
    });
    document.cookie = cookieString + this.expirationDate;
  }

  getCookieExpiration(): string {
    const d = new Date();
    d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
    return "expires=" + d.toUTCString();
  }

  getDomain(): string {
    const domainName = (window as any).location.hostname;
    return "path=" + domainName;
  }

  clearAll(){
    document.cookie = "";
  }
}

