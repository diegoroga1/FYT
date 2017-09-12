import { NgModule, ErrorHandler,ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Http,Response ,HttpModule} from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Entrenadores} from '../pages/entrenadores/entrenadores'
import {Inicio} from '../pages/inicio/inicio'
import {Perfil} from '../pages/perfil/perfil'
import {Chat} from '../pages/chat/chat'
import { Tabs } from '../pages/tabs/tabs';
import {VistaEntrenador} from '../pages/vista-entrenador/vista-entrenador'
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, Geocoder } from '@ionic-native/google-maps';
import { Toast } from '@ionic-native/toast';

import { Ionic2RatingModule } from 'ionic2-rating';
import { DataTrainer } from '../providers/data-trainer';
import { CogerDatos} from '../providers/coger-datos';
import {CardTrainer} from '../components/card-trainer/card-trainer';
import {CardPubli} from '../components/card-publi/card-publi';
import {MapComponent} from '../components/map-component/map-component'
export const firebase={
  apiKey: "AIzaSyAmdijlzMaRzeXEmIcWTAImU8SgtCI1mTA",
  authDomain: "fytrainer-69aef.firebaseapp.com",
  databaseURL: "https://fytrainer-69aef.firebaseio.com",
  projectId: "fytrainer-69aef",
  storageBucket: "fytrainer-69aef.appspot.com",
  messagingSenderId: "179397221458"
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Entrenadores,
    Inicio,
    Perfil,
    Chat,
    Tabs,
    CardTrainer,
    CardPubli,
    VistaEntrenador,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Entrenadores,
    Inicio,
    Perfil,
    Chat,
    Tabs,
    CardTrainer,
    CardPubli,
    VistaEntrenador,
    MapComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataTrainer,
    CogerDatos,
    Geolocation,
    GoogleMaps,
    Geocoder,
    ViewChild,
    Toast,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}