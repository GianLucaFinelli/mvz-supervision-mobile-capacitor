export const environment = {
  version: '3.0.1',
  production: false,

  supportUser: '',
  supportPass: '',
  entorno: 'desarrollo',

  tenantId: '4',
  aplicacionId: 2,

  // TODO: CAMBIAR CREDENCIALES DE PUSH NOTIFICATION POR LAS DE COCCOLO
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
    vapidKey: ''
  },

  google: {
    mapsAPIKey: '',
    cloudVisionAPIKey: '',
  },

  // Compilar siempre apuntado a producción y
  // lo cambiamos luego con 999999 así podemos pasar la appa sin recompilar

  apiBaseUrl: 'https://apps-dev.mvzn.me/',
  apiDevBaseUrl: 'https://apps-dev.mvzn.me/',
  apiTestBaseUrl: 'https://apps-dev.mvzn.me/',
  apiUATBaseUrl: 'https://apps-dev.mvzn.me/',
  apiProdBaseUrl: 'https://apps-dev.mvzn.me/',


  modulo: 'supervision-be',
  // Si enviamos la url completa no considera el apiBaseUrl. Esto solo en desarrollo.
  general: 'general-be',
  storage:'storage-be',

  // Listado de urls sin autenticación
  publicUrls: [
    'token',
    'version',
    'resetear-password',
  ],
};
