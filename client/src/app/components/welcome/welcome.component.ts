import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    // console.log(await this.auth.isLoggedIn());
    if ((await this.auth.isLoggedIn()) != null) {
      this.router.navigateByUrl('dashboard');
    }
  }

  login() {
    this.auth.googleSignin();
    this.router.navigateByUrl('dashboard');
  }
}
