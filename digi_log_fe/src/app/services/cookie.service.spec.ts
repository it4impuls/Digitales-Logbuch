import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';
import { CookieType } from '../interfaces';



describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService],
    });
    service = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFromCookie', () => {
    it('should return the value of the cookie if it exists', () => {
      const cookieValue = 'testValue';
      service.addToCookie(CookieType.refreshToken, cookieValue);
      expect(service.getValue(CookieType.refreshToken)).toEqual(cookieValue);
    });

    it('should return undefined if the cookie does not exist', () => {
      expect(service.getValue(CookieType.username)).toBeUndefined();
    });
  });

  describe('removeFromCookie', () => {
    it('should set the value of the cookie to an empty string', () => {
      const cookieValue = 'testValue';
      document.cookie = `${CookieType.refreshToken}=${cookieValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
      service.removeFromCookie(CookieType.refreshToken);
      expect(document.cookie).toContain(`${CookieType.refreshToken}=`);
      expect(service.getValue(CookieType.refreshToken)).toBe("");
    });
  });

  describe('getCookieExpiration', () => {
    it('should return the correct expiration date string', () => {
      const expirationDate = service.getCookieExpiration();
      const d = new Date();
      d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expectedExpirationDate = 'expires=' + d.toUTCString();
      expect(expirationDate).toEqual(expectedExpirationDate);
    });
  });

  describe('getDomain', () => {
    it('should return the correct domain string', () => {
      const domainName = (window as any).location.hostname;
      const expectedDomain = `path=${domainName}`;
      expect(service.getDomain()).toEqual(expectedDomain);
    });
  });
});
