// import { Injectable } from '@angular/core';
// import { Capacitor } from '@capacitor/core';
// import { environment } from 'src/environments/environment';
// import { FirebaseMessaging, GetTokenOptions } from '@capacitor-firebase/messaging';
// import { initializeApp } from 'firebase/app';
// import { getStorage } from 'firebase/storage';
// import { TransporteNotificacionesService } from 'src/app/features/general/@core/services/transporte-notificaciones.service';
// import { DispositivoService } from 'src/app/features/general/@core/services/dispositivo.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class FirebaseNotificationService {

//   constructor(
//     private transporteNotificacionesService: TransporteNotificacionesService,
//     private dispositivoService: DispositivoService) {

//   }

//   public async initializeFirebase(): Promise<void> {
//     if (Capacitor.isNativePlatform()) {
//       const app = initializeApp(environment.firebase);
//       getStorage(app);
//       this.runNotificationConfigs();
//       return;
//     }
//     // Initialize Firebase
//     const app = initializeApp(environment.firebase);

//     getStorage(app);
//     this.runNotificationConfigs();
//   }

//   async runNotificationConfigs() {
//     FirebaseMessaging.addListener("notificationReceived", (event: any) => {
//       console.log("notificationReceived: ", event);
//       this.transporteNotificacionesService.notificationReceived.emit(event);
//     });
//     FirebaseMessaging.addListener("notificationActionPerformed", (event: any) => {
//       console.log("notificationActionPerformed: ", event);
//       this.transporteNotificacionesService.notificationActionPerformed.emit(event);
//     });
//     if (Capacitor.getPlatform() === "web") {
//       navigator.serviceWorker.addEventListener("message", (event: any) => {
//         console.log("serviceWorker message: ", { event });
//         const notification = new Notification(event.data.notification.title, {
//           body: event.data.notification.body,
//         });
//         notification.onclick = (event) => {
//           console.log("notification clicked: ", { event });
//         };
//       });
//     }
//     await FirebaseMessaging.requestPermissions();
//     const options: GetTokenOptions = {
//       vapidKey: environment.firebase.vapidKey,
//     };
//     if (Capacitor.getPlatform() === "web") {
//       options.serviceWorkerRegistration = await navigator.serviceWorker.register("firebase-messaging-sw.js");
//       const { token } = await FirebaseMessaging.getToken(options);  // así funciona para web
//       localStorage.setItem("firebaseToken", token);
//       const appToken = localStorage.getItem('token');
//       if (appToken) {
//         this.dispositivoService.registrarDispositivo(token).subscribe({
//           next: (resp) => {},
//         });;
//       }
//     } else {
//       const { token } = await FirebaseMessaging.getToken();  // así funciona para app celu
//       localStorage.setItem("firebaseToken", token);
//       const appToken = localStorage.getItem('token');
//       if (appToken) {
//         this.dispositivoService.registrarDispositivo(token).subscribe({
//           next: (resp) => {},
//         });;
//       }
//     }
//   }
// }
