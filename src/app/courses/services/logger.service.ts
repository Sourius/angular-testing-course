import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  info(message: string) {
    console.info(message);
  }

  log(message:string) {
    console.log(message);
  }

  error(message: string) {
    console.error(message);
  }

}
