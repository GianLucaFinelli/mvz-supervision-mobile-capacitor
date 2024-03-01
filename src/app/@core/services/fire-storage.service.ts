// import { Injectable } from '@angular/core';
// import { FirebaseStorage, getDownloadURL, getStorage, listAll, ref, StorageReference, uploadString } from "firebase/storage";
// import { Observable } from 'rxjs/internal/Observable';
// import { LoadingService } from './loading.service';

// // referencia a la documentación
// // https://firebase.google.com/docs/storage/web/start?hl=es-419&authuser=0

// @Injectable({
//   providedIn: 'root',
// })
// export class FireStorageService {
//   storage: FirebaseStorage;
//   imagesRef: StorageReference;

//   constructor(private loadingService: LoadingService) {
//     this.storage = getStorage();
//   }

//   async uploadImageDataUrl(data_url: string, fileName: string): Promise<any> {
//     const loading = await this.loadingService.show();
//     // Data URL string
//     //const data_url = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
//     return await uploadString(ref(this.storage, 'dev/images/'+fileName), data_url, 'data_url').then((snapshot: any) => {
//       console.log('Uploaded a data_url string!');
//       console.log(snapshot);
//       loading.dismiss();
//       return snapshot.metadata.fullPath;
//     }).catch((error: any) => {
//       console.log(error);
//       loading.dismiss();
//       return null;
//     });
//   }

//   async getAllImages() {
//     const images: { url: string }[] = [];
//     await listAll(ref(this.storage, 'dev/images')).then((result: any) => {
//       result.items.forEach((imageRef: any) => {
//         // Obtiene la URL de descarga de cada imagen
//         getDownloadURL(imageRef).then((url: any) => {
//           images.push({ url });
//         });
//       });
//     });
//     return images;
//   }
// }
