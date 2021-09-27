import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(environment.WEB3_PROVIDER);
  }
}
