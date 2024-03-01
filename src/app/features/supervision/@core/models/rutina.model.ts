import { SECTOR_STATUS } from "./enums/sector-status.enum";

export class Rutina {

    id: number;
    descripcion: string;
    rutinaId: number;
    userId: number;
    localizacionId: number;
    tareaId: number;
    visitaId: number;

    fechaHora: string;
    fechaHoraVisita: string;
    comentario: string;

    status: SECTOR_STATUS.MISSING | SECTOR_STATUS.FAIL | SECTOR_STATUS.OK;
    imagen?: Rutinaimagen | null;
    sended: boolean;
    fileSended: boolean;
    sectorId: number | string;
    sectorNombre: string;
    lat: number;
    long: number;

    archivoId: number;
    fileName: string;
    fileFormat: string;
    fileOfflineSended: boolean = false;
}

export class Rutinaimagen {
    path: string;
    name: string;
}
