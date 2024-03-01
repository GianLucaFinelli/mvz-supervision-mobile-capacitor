import { Injectable, Output, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MensajeSinLeerNotificationServiceService {
  @Output() changeMessage: EventEmitter<string> = new EventEmitter();


  constructor() { }

  emit(value:any) {
    this.changeMessage.emit(value);
}
}
