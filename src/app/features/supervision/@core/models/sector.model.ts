import { SECTOR_STATUS } from "./enums/sector-status.enum";
import { Rutina } from "./rutina.model";
import { Tarea } from "./tarea.model";


export class Sector {

    codigoQR: string;
    descripcion: string;
    id: number;
    sitioNombre: string;
    status: SECTOR_STATUS.MISSING | SECTOR_STATUS.FAIL | SECTOR_STATUS.OK;
    rutinas?: Rutina[];
    useServerDatetime: boolean;
    useGps: boolean;

    updatedBy: number;
    updatedDateTime: string;

    subSitio: SubSitio;
    subSitioId: number;
    subSitioNombre: string;

    tipoSector: TipoSector;
    tipoSectorId: number;
    tipoSectorNombre: string;

    tareas: Tarea[];
}

export class SubSitio {
    id: number;
    descripcion: string;
    sitioId: number;
    sitio?: Sitio;

    localizacionId: number;
}

export class Sitio {
    descripcion: string;
    id: number;
    localizacion?: Localizacion;
    localizacionId: number;
}

export class Localizacion {
    cliente?: string;
    clienteId: number;
    descripcion: string;
    id: number;
}

export class TipoSector {
    id: number;
    descripcion: string;
    isClock: boolean;
}

