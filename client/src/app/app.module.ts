import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { WebcamModule } from 'ngx-webcam';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaceScanComponent } from './components/face-scan/face-scan.component';

@NgModule({
  declarations: [AppComponent, WelcomeComponent, FaceScanComponent],
  imports: [BrowserModule, AppRoutingModule, WebcamModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
