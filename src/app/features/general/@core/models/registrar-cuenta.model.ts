import { environment } from "src/environments/environment"

export class RegistrarCuentaModel {
  username: number
  password: string
  confirmPassword: string
  telefono: number
  confirmTelefono: number
  verificationCode: number
  verificatonCodeBackend: number
  completeName: string;
  nombre: string;
  apellido: string;
  nacionalidad: string
  provincia: string
  localidad: string
  email: string
  dniFrente: string
  dniDorso: string
  cuitFacturacion: number
  razonSocialFacturacion: string
  stepsStatus: StepsStatus
  tenantId: number

  constructor(data: Partial<RegistrarCuentaModel>) {
    Object.assign(this, data);
    this.tenantId = parseInt(environment.tenantId);
  }
}

export interface StepsStatus {
  step1Complete: boolean
  step2Complete: boolean
  step3Complete: boolean
  step4Complete: boolean
  step5Complete: boolean
  step6Complete: boolean
}

export const RegistrarCuentaConstante = {
  name: "RegisterData",
  emptyJson: '{"username": null, "password": null, "confirmPassword": null, "telefono": null, "confirmTelefono": null, "verificationCode": null, "verificatonCodeBackend": null, "completeName": null, "nombre": null, "apellido": null, "nacionalidad": null, "provincia": null, "localidad": null, "email": null, "dniFrente": null, "dniDorso": null, "cuitFacturacion": null, "razonSocialFacturacion": null, "stepsStatus": {"step1Complete": false, "step2Complete": false, "step3Complete": false, "step4Complete": false, "step5Complete": false, "step6Complete": false, "tenantId": null}}'
}

