export interface AfipResponse {
  personaId: number
  numeroDocumento: string
  nombre: string
  apellido: string
  domicilios: Domicilio[]
  actividadPrincipalId: number
  actividadPrincipalDescripcion: string
  estadoClaveDescripcion: string
  fechaNacimiento: string
  formaJuridicaDescripcion: any
  razonSocial: any
  tipoClave: string
  tipoDocumento: string
  tipoPersona: string
}

export interface Domicilio {
  calle: string
  numeroCalle: number
  codigoPostal: string
  provinciaDescripcion: string
  localidadDescripcion: string
}
