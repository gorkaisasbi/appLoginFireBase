import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { map } from "rxjs/operators";
import { hostViewClassName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url ="https://identitytoolkit.googleapis.com/v1/accounts:";
  private API_KEY="AIzaSyDKorxdYscTgidkulJeDxD23YBVpUFgWOU";
  private userToken : string = null;

  //nuevos usuarios
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  

  constructor(private http: HttpClient) {
    this.leerToken();
   }

  logout(){
    localStorage.removeItem("token");
  }
  login(usuario : Usuario){

    const authData={
      ...usuario,
      returnSecureToken : true
  };
  return this.http.post(
    `${this.url}signInWithPassword?key=${this.API_KEY}`,
    authData
  ).pipe(map(resp =>{
      this.guardarToken(resp["idToken"]);
      return resp;
    }));

  }
  nuevousuario(usuario : Usuario){

    const authData={
        ...usuario,
        returnSecureToken : true
    };
    return this.http.post(
      `${this.url}signUp?key=${this.API_KEY}`,
      authData
    ).pipe(map(resp =>{
          this.guardarToken(resp["idToken"]);
          return resp;
    }));

  }

  guardarToken(idToken : string){
    this.userToken = idToken;
    localStorage.setItem("token",this.userToken);
    let hoy = new Date();
    hoy.setSeconds(36000);
    localStorage.setItem("expira",hoy.getTime().toString());
  }

  leerToken(){
    if(localStorage.getItem("token")){
      this.userToken = localStorage.getItem("token");
    }else{
      this.userToken = "";
    }
    return this.userToken;
  }
  
  estaAutenticado(): boolean{

    if(this.userToken.length <2){
      return false;
    }

    const expira = Number(localStorage.getItem("expira"));

    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }

  }

}
