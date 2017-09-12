import { Injectable,Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';
/*
  Generated class for the CogerDatos provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CogerDatos {
  data:any;
  datos:FirebaseListObservable<any>;
  entrenadores:FirebaseListObservable<any>;
  publicaciones:FirebaseListObservable<any>;
  constructor(public af:AngularFireDatabase,@Inject(FirebaseApp) firebaseApp: firebase.app.App) {
    console.log('Hello CogerDatos Provider');

  }

  getDataUser(){
    this.datos=this.af.list('/usuarios')
    return this.datos;
  }
  getDataTrainer(){
    this.entrenadores=this.af.list('/entrenadores')
    console.log(this.entrenadores);
    return this.entrenadores
  }
  getPublicacionesTrainer(){
    this.publicaciones=this.af.list('/publicaciones')
    return this.publicaciones
  }
  /*getPhotoTrainer(){
    firebaseApp.storage().ref().child('/fotos-perfil/').getDownloadURL().then(url => this.imageDefault = url);

  }*/

}