import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { WebcamModule } from 'ngx-webcam';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaceScanComponent } from './components/face-scan/face-scan.component';

@NgModule({
  declarations: [AppComponent, WelcomeComponent, FaceScanComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AppRoutingModule,
    WebcamModule,
  ],
  providers: [{ provide: BUCKET, useValue: 'orange-identity.appspot.com' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
