import { Component ,Inject} from '@angular/core';
import {DataTrainer} from '../../providers/data-trainer';
import {CogerDatos} from '../../providers/coger-datos';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http,Response } from '@angular/http'
import { Tabs } from '../tabs/tabs';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";
import {CardTrainer} from '../../components/card-trainer/card-trainer';
import {VistaEntrenador} from '../../pages/vista-entrenador/vista-entrenador'
import {FiltrarEntrenadorPage} from '../../pages/filtrar-entrenador/filtrar-entrenador'
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';
import * as _ from 'lodash';
@IonicPage()
@Component({
  selector: 'page-entrenadores',
  templateUrl: 'entrenadores.html'
})

export class Entrenadores {
  title_page:any;
  json_entrenadores:any;
  datosUsuario:FirebaseListObservable<any>;
  datosEntrenador:FirebaseListObservable<any>;
  busqueda:string='';
  nombre_entrenadores:any=[];
  filtroEntrenadores=[];
  filtrado=false;
  filtros:any;
  userKey:any;
  modoOrdenacion;
  ordenado=false;
  fotoPerfil:any;
  constructor(public navCtrl: NavController,
              public http:Http,
              public cogerDatos:CogerDatos,
              public navParams: NavParams,
              @Inject(FirebaseApp) public firebaseApp: firebase.app.App,
  ) {
    this.title_page="Entrenadores";
    this.datosUsuario=this.cogerDatos.getDataUser();
    this.datosEntrenador=this.cogerDatos.getDataTrainer();
    console.log(this.datosEntrenador)
    this.datosEntrenador.forEach(data=>{
      console.log(data.$key);
      this.firebaseApp.storage().ref().child( data.$key +'/foto-perfil/perfil.jpg').getDownloadURL()
        .then(url => this.fotoPerfil = url)
        .catch(error=>console.log(data.nombre+ " NO hay foto de perfil"));
    })
    localStorage.removeItem('filtro');
    this.userKey=localStorage.getItem('user_uid');
  }
  ionViewDidEnter(){
    if(localStorage.getItem('filtro')){
      this.filtros=JSON.parse(localStorage.getItem('filtro'));
      this.filtrado=true;

    }else{
      this.filtrado=false;
    }
    if(this.filtrado){
      this.filtrar();
    }
    if(this.modoOrdenacion){
      this.ordenar()
    }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Entrenadores');
  }
  buscarEntrenador(){
    let searchLower=this.busqueda.toLowerCase();
    let filtradoNombres=[];
    let nombre_entrenadores=_.filter(this.json_entrenadores,ents=>(<any>ents).nombre.toLowerCase().includes(searchLower));
    if(nombre_entrenadores.length){
      nombre_entrenadores.forEach(item=>{
        filtradoNombres.push({nombre:item.nombre});
      })
    }

    this.nombre_entrenadores=filtradoNombres;
  }
  irAVistaEntrenador(entrenador,fotoPerfil){
    this.navCtrl.push(VistaEntrenador,{entrenador,fotoPerfil})
  }
  goFilterTrainer(){
    this.navCtrl.push(FiltrarEntrenadorPage)
  }
  filtrar(){
    var arrayAux=[];
    this.filtroEntrenadores=[];
    this.datosEntrenador.forEach(data=>{
      data.forEach(item=>{
        arrayAux.push(item);
      })
      if(this.filtros &&this.filtros.length==1){
        arrayAux.forEach((entrenador)=>{
          if(entrenador.servicio){
            this.filtros.forEach(filtro=>{
              if(filtro.precios){
                _.find(entrenador.servicio.tarifas,(tarifa)=>{
                  if(tarifa.precio>parseInt(filtro.precios.precio1)&&tarifa.precio<parseInt(filtro.precios.precio2)){
                    if(!_.includes(this.filtroEntrenadores,entrenador)){
                      this.filtroEntrenadores.push(entrenador)
                    }
                  }
                })
              }

              if(filtro.localidad){
                if(_.includes(entrenador.localidad,filtro.localidad)){
                  if(!_.includes(this.filtroEntrenadores,entrenador)){
                    this.filtroEntrenadores.push(entrenador)
                  }
                }
              }
              if(filtro.especialidades){
                _.find(entrenador.servicio.especialidad, (esp) => {
                  _.find(filtro.especialidades,(e)=>{
                    if(e==esp){
                      if (!_.includes(this.filtroEntrenadores, entrenador)) {
                        this.filtroEntrenadores.push(entrenador)
                      }
                    }
                  })
                })
              }
              if(filtro.genero){
                if(entrenador.sexo==filtro.genero){
                  if(!_.includes(this.filtroEntrenadores,entrenador)){
                    this.filtroEntrenadores.push(entrenador);
                  }
                }
              }
            })
          }
        })
      }else if(this.filtros&&this.filtros.length>1){
        let noFiltrar=[];
        arrayAux.forEach((entrenador)=>{
          if(entrenador.servicio){
            this.filtros.forEach(filtro=> {
              if (filtro.especialidades) {
                if(!_.includes(noFiltrar,entrenador)){
                  _.find(entrenador.servicio.especialidad, (esp) => {
                    if(_.includes(filtro.especialidades,esp)){
                      if (!_.includes(this.filtroEntrenadores, entrenador)) {
                        this.filtroEntrenadores.push(entrenador)
                      }
                    }
                  })
                  if (!_.includes(this.filtroEntrenadores, entrenador)) {
                    if(!_.includes(noFiltrar,entrenador)){
                      noFiltrar.push(entrenador);
                    }
                  }
                }
              }
            if (filtro.genero) {
                if(!_.includes(noFiltrar,entrenador)){
                  if(entrenador.sexo==filtro.genero){
                    if(!_.includes(this.filtroEntrenadores,entrenador)){
                      this.filtroEntrenadores.push(entrenador);
                    }
                  }else{
                    _.remove(this.filtroEntrenadores,entrenador);
                    noFiltrar.push(entrenador);
                  }
               }
              }
            if(filtro.precios){
              if(!_.includes(noFiltrar,entrenador)){
                _.find(entrenador.servicio.tarifas,(tarifa)=>{
                  if(tarifa.precio>parseInt(filtro.precios.precio1)&&tarifa.precio<parseInt(filtro.precios.precio2)){
                    if(!_.includes(this.filtroEntrenadores,entrenador)){
                      this.filtroEntrenadores.push(entrenador)
                    }
                  }
                })
                if (!_.includes(this.filtroEntrenadores, entrenador)) {
                  if(!_.includes(noFiltrar,entrenador)){
                    noFiltrar.push(entrenador);
                  }
                }
              }

            }
            if(filtro.localidad){
              console.log(filtro.localidad)
              if(!_.includes(noFiltrar,entrenador)){
                if(_.includes(entrenador.localidad,filtro.localidad)){
                  if(!_.includes(this.filtroEntrenadores,entrenador)){
                    this.filtroEntrenadores.push(entrenador)
                  }
                }else{
                  _.remove(this.filtroEntrenadores,entrenador);
                  noFiltrar.push(entrenador);
                }
              }
            }
              console.log(this.filtroEntrenadores)
              console.log(noFiltrar);
            })
      }
        })

  }
      else{
        this.filtrado=false;
      }
    })

  }

  ordenar(){
    if(this.modoOrdenacion){
      this.ordenado=true;
    }
    if(this.filtrado){
      console.log(this.filtrado)
      if(this.modoOrdenacion=='valorados'){
        this.filtroEntrenadores=_.orderBy(this.filtroEntrenadores,['servicio.valoracionTotal'],['desc']);
        console.log(this.filtroEntrenadores);
      }else if(this.modoOrdenacion=='recientes'){
        this.filtroEntrenadores=_.orderBy(this.filtroEntrenadores,['servicio.fechaCreacion'],['desc']);
        console.log(this.filtroEntrenadores);

      }else if(this.modoOrdenacion=='baratos'){
        this.filtroEntrenadores.forEach(data=>{
          if(data.servicio){
            data.servicio.tarifas.forEach((tarifa,index)=>{
              this.filtroEntrenadores=_.orderBy(this.filtroEntrenadores,['servicio.tarifas['+index+'].precio'],['asc']);

            })
          }

        })

      }
      console.log("hay fitlros");
    }else{
      console.log("no hay filtros");
      this.filtroEntrenadores=[]
      this.datosEntrenador.forEach(data=>{
        data.forEach(item=>{
          this.filtroEntrenadores.push(item);
        });

      })
        if(this.modoOrdenacion=='valorados'){
          this.filtroEntrenadores=_.orderBy(this.filtroEntrenadores,['servicio.valoracionTotal'],['desc']);
          console.log(this.filtroEntrenadores);
        }else if(this.modoOrdenacion=='recientes'){
          this.filtroEntrenadores=_.orderBy(this.filtroEntrenadores,['servicio.fechaCreacion'],['desc']);
          console.log(this.filtroEntrenadores);

        }else if(this.modoOrdenacion=='baratos'){
          this.filtroEntrenadores.forEach(data=>{
            if(data.servicio){
              data.servicio.tarifas.forEach((tarifa,index)=>{
                this.filtroEntrenadores=_.orderBy(this.filtroEntrenadores,['servicio.tarifas['+index+'].precio'],['asc']);

              })
            }

          })

        }
          console.log(this.filtroEntrenadores);


    }
  }


}
