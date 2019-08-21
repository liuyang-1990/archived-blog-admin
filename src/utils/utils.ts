import { parse } from 'qs';
import jwt_decode  from 'jwt-decode';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}


export function decodeJwt(token): string {
  return jwt_decode(token);
}
