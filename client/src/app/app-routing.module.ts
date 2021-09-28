import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceScanComponent } from './components/face-scan/face-scan.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'face', component: FaceScanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
