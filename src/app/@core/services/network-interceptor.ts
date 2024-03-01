import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, EMPTY, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { NetworkService } from "./network.service";
import { NotificationService } from "./notification.service";

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService, private networkService: NetworkService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.networkService.validateForInterceptor()).pipe(
      mergeMap((resp) => {
        if (resp) {
          return next.handle(req);
        } else {
          // Aquí puedes agregar la lógica para manejar la falta de conexión
          this.notificationService.showMessage(
            'No se detectó conexión de datos para poder realizar la acción solicitada.'
          );
          // Puedes lanzar un error o retornar una respuesta de error, según tus necesidades
          // O: EMPTY; // Devuelve un observable vacío para cancelar la solicitud
          return of(new HttpResponse({ status: 0, statusText: "No hay conexión a Internet" })); // Devuelve un observable vacío para cancelar la solicitud
        }
      })
    );
  }
}
