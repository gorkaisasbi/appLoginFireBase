import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: Usuario;
  recuerdame : boolean = true;

  constructor(private auth : AuthService, private router : Router) {
   }

  ngOnInit() {
      this.usuario = new Usuario();
      this.usuario.email = "grk@gmail.com";
      this.usuario.nombre = "Gorka";
      this.usuario.password = "123456";

   }


   onSubmit(form:NgForm){
      if(form.invalid)return;

      Swal.fire({
         allowOutsideClick : true,
         text : "Espere por favor..."
       });
       Swal.showLoading();

      this.auth.nuevousuario(this.usuario).subscribe(resp=>{
         console.log(resp);
         Swal.close();
         if(this.recuerdame){
            localStorage.setItem("email",this.usuario.email);
         }
         this.router.navigateByUrl("/home");
      },err=>{
         console.log(err.error.error.message);
         Swal.fire({
            title :"ERROR",
            icon : "error",
            text : err.error.error.message
          });
          Swal.showLoading();
      });
   }

}
