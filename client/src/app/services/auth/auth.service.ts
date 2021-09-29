import { Injectable } from '@angular/core';
import { User } from '../../models/user.model'; // optional

import { Router } from '@angular/router';

import { GoogleAuthProvider } from 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user: any) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      face: false,
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }

  async isLoggedIn() {
    return await this.afAuth.authState.pipe(first()).toPromise();
  }

  async getName() {
    const res = await this.afAuth.authState.pipe(first()).toPromise();
    return res?.displayName;
  }

  async getUID() {
    const res = await this.afAuth.authState.pipe(first()).toPromise();
    return res?.uid;
  }

  async getImage() {
    const res = await this.afAuth.authState.pipe(first()).toPromise();
    return res?.photoURL;
  }
}
