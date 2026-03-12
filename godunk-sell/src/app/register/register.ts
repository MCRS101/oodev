import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
 name = "";
  email = "";
  password = "";

  constructor(private http: HttpClient, private router: Router) {}

  register(){

    const body = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post("http://localhost:3000/api/register", body)
    .subscribe({
      next:(res:any)=>{
        alert("Register success");
        console.log(res);
        this.router.navigate(['/']);
      },
      error:(err)=>{
        console.log(err);
        alert("Register failed");
      }
    });

  }
}
