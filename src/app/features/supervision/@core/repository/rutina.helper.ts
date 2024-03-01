import { LocalizacionSectorTareaLog } from "../models/visita.model";

export class RutinaHelper {

  static formatearRutina(rutina: any): LocalizacionSectorTareaLog {
    return  {
      id: 0,
      localizacionId: rutina.localizacionId,
      sectorId: rutina.sectorId,
      tareaId: rutina.tareaId,
      visitaId: rutina.visitaId,
      fechaHoraVisita: rutina.fechaHoraVisita,
      fechaHora: rutina.fechaHora,
      comentario: rutina.comentario,
      estadoRutina: rutina.status,
      imagen: rutina.imagen,
      archivoId: rutina.archivoId ?? null
    } as LocalizacionSectorTareaLog
  }

}
