import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firebase } from '@firebase/app';
import '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;
  user: User;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) 
  { 
    // this.user$ = this.afAuth.authState.pipe(
    //   switchMap(user => {
    //     if(user){
    //       return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
    this.afAuth.authState.subscribe(user => {
      if (user)
      {
        console.log("user is not null authstate");
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };;
        //return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        //localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        console.log("user is null");
        return of(null);
        //localStorage.setItem('user', null);
      }
    })
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
     const credential = await this.afAuth.signInWithPopup(provider);

     return this.updateUserData(credential.user);
    //console.log("top of sign in")

    // await firebase.auth().signInWithPopup(provider).then(function(result) {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   //var token = result.credential.accessToken;
    //   // The signed-in user info.
    //   // console.log(result)
    //   // console.log("signed in");
    //   return this.updateUserData(result.user);
    //   // ...
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   console.log("error in signing in");
    //   console.log(error);
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });



  }

  async googleSignOut(){
    await this.afAuth.signOut();
    return this.router.navigate(['/']);

    // await firebase.auth().signOut().then(function() {
    //   // Sign-out successful.
    //   console.log("signed out");
    // }).catch(function(error) {
    //   // An error happened.
    // });

  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, {merge: true});
  }

  

}
