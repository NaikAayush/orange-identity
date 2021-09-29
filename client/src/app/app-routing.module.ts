import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFlightComponent } from './components/add-flight/add-flight.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FaceScanComponent } from './components/face-scan/face-scan.component';
import { FlightsComponent } from './components/flights/flights.component';
import { PassportComponent } from './components/passport/passport.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'face', component: FaceScanComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'passport', component: PassportComponent },
  { path: 'flights', component: FlightsComponent },
  { path: 'flights/add', component: AddFlightComponent },
  { path: 'ticket', component: TicketComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
