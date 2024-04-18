import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  log(message: string){
    if (!environment.production) { 
      console.log(message)
    }
  }

}
