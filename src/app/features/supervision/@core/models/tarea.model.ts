import { SECTOR_STATUS } from "./enums/sector-status.enum";

export class Tarea {
  descripcion: string;
  id: number;
  status: SECTOR_STATUS.MISSING | SECTOR_STATUS.FAIL | SECTOR_STATUS.OK;
}
