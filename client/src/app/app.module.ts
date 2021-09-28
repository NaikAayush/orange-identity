import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { WebcamModule } from 'ngx-webcam';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaceScanComponent } from './components/face-scan/face-scan.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [AppComponent, WelcomeComponent, FaceScanComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    WebcamModule,
  ],
  providers: [{ provide: BUCKET, useValue: 'orange-identity.appspot.com' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
