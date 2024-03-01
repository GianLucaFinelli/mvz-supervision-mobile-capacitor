import { NewVisita, SectorVisita } from "../models/visita.model";

export class VisitaHelper {

    static FormattedNewVisita(rutinas: any[], rutinasFormated: any[] = [], visitaData: SectorVisita | null) {

        let tieneObservaciones = rutinas.find((rutina: any) => {
            return rutina.comentario != null && rutina.comentario != "" || rutina.imagen != null;
        }) ? true : false;

        function getLoggedUser(): any {
            if (localStorage.getItem('usuario-logueado')) {
                var usuarioLoggueado =  JSON.parse(localStorage.getItem('usuario-logueado') as string);
                return usuarioLoggueado;
              } else {
                return '';
              }
        }

        const loggedUser = getLoggedUser();
        const loggedUserName = loggedUser.nombre + " " + loggedUser.apellido;

        if(visitaData) {
            let newVisita: NewVisita = {
              id: 0,
              localizacionId: visitaData.subSitio.localizacionId,
              sitioId: visitaData.subSitio.sitioId,
              subSitioId: visitaData.subSitioId,
              sectorId: visitaData.id, // sector
              usuarioId: loggedUser.id,
              usuarioResponsable: loggedUserName,
              latitud: visitaData.lat,
              longitud: visitaData.long,
              fechaHoraVisita: rutinas[0].fechaHoraVisita,
              tieneObservaciones: tieneObservaciones,
              rutinas: rutinasFormated
          };
          return newVisita;
        }
        else {
          let newVisita: NewVisita = {
              id: 0,
              localizacionId: rutinas[0].localizacionId,
              sitioId: rutinas[0].sitioId,
              subSitioId: rutinas[0].subSitioId,
              sectorId: rutinas[0].sectorId,
              usuarioId: rutinas[0].usuarioId,
              usuarioResponsable: loggedUserName,
              latitud: rutinas[0].lat,
              longitud: rutinas[0].long,
              fechaHoraVisita: rutinas[0].fechaHoraVisita,
              tieneObservaciones: tieneObservaciones,
              rutinas: rutinasFormated
          };
          return newVisita;
        }
    }


}
