import { parse } from 'querystring';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function decodeJwt(token): string {
  return jwt_decode(token);
}

export enum TimeStringFormat {
  STANDARD_TIME = "YYYY-MM-DD HH:mm:ss",
  STANDARD_DATE = "YYYY-MM-DD"

}

export function toLocaleTimeString(time: string | moment.Moment | undefined, format: TimeStringFormat = TimeStringFormat.STANDARD_TIME): string {
  return moment(time).format(format);
}
