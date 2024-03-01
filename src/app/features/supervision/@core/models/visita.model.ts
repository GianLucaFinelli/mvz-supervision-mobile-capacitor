import { SECTOR_STATUS } from "./enums/sector-status.enum";
import { Rutina, Rutinaimagen } from "./rutina.model";
import { SubSitio, TipoSector } from "./sector.model";
import { Tarea } from "./tarea.model";

export class SectorVisita {
    codigoQR: string;
    descripcion: string;
    id: number;
    rutinas: VisitaRutina[];
    sitioNombre: string;
    status: SECTOR_STATUS.MISSING | SECTOR_STATUS.FAIL | SECTOR_STATUS.OK;

    subSitio: SubSitio;
    subSitioId: number;
    subSitioNombre: string;
    tareas: Tarea[];

    tipoSector: TipoSector;
    tipoSectorId: number;
    tipoSectorNombre: string;

    updatedBy: number;
    updatedDateTime: string;

    useGps: boolean;
    useServerDatetime: boolean;

    localizacionId: number;
    sectorId: number;
    sitioId: number;
    usuarioId: number;

    lat: string;
    long: string;

    fechaHoraVisita: string;

    sended?: boolean;
    index: number; // indice local para borrar la visita en caso de tener 2 visitas al mismo sector
}

export class VisitaRutina {
    comentario: string;
    // dateTime: string;
    descripcion: string;
    fechaHora: string;
    fechaHoraVisita?: string;
    id: number;
    localizacionId: number;
    sectorId: number;
    sitioId: number;
    status: SECTOR_STATUS.MISSING | SECTOR_STATUS.FAIL | SECTOR_STATUS.OK;
    subSitioId: number;
    tareaId: number;
    usuarioId: string;
    usuarioResponsable: string;

    lat: string;
    long: string;

    //------------
    visitaId?: number;
    sended?: boolean;
    fileSended?: boolean;
    imagen?: Rutinaimagen;
}


export class LocalizacionSectorTareaLog {
    id: number;
    localizacionId: number;
    sectorId: number;
    tareaId: number;
    visitaId: number;
    usuarioId: number;
    fechaHoraVisita: string;
    fechaHora: string;
    comentario: string;
    estadoRutina: string;
    imagen?: string | object;
    archivoId: number;
}

export class NewVisita {
    id: number;
    localizacionId: number;
    sitioId: number;
    subSitioId: number;
    sectorId: number;
    usuarioId: number;
    usuarioResponsable: string;
    latitud: string;
    longitud: string;
    fechaHoraVisita: string;
    tieneObservaciones: boolean;
    rutinas: LocalizacionSectorTareaLog[];
}
