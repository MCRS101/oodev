import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
 email = "";
  password = "";

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(){

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post("https://ungrafted-dilan-condimentary.ngrok-free.dev/api/login", body)
    .subscribe({
      next:(res:any)=>{

        alert("Login success");

        console.log(res);

        // บันทึก user
        localStorage.setItem("user", JSON.stringify(res.user));

        // ไปหน้า dashboard
        this.router.navigate(['/home']);

      },
      error:(err)=>{
        console.log(err);
        alert("Email หรือ Password ไม่ถูกต้อง");
      }
    });

  }

}
