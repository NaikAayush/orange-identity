import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  name: any;
  imagePath: any;
  constructor(public auth: AuthService) {}

  async ngOnInit() {
    this.name = await this.auth.getName();
    this.imagePath = await this.auth.getImage();
  }
}
