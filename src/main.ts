import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/@core/services';
import { NetworkInterceptor } from './app/@core/services/network-interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true }, // Agrega tu NetworkInterceptor aquí
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(IonicModule.forRoot({
      innerHTMLTemplatesEnabled: true
    })),
    provideRouter(routes),
  ],
});

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
