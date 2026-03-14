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
  confirmPassword= "";
  constructor(private http: HttpClient, private router: Router) {}

  register(){
// check password match
    if(this.password !== this.confirmPassword){
      alert("Password ไม่ตรงกัน");
      return;
    }
    const body = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post("/api/register", body)
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
