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
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  openvideo(){
    alert('กะแนวนี้แหละ รหัสกะยังลืม เขาเด้ คือลืม บ่ได้ sing"บ่ฮักกะเซาเถาะ ไปต่อบ่ไดกะพอซำนี้นั่นละ"');
    window.open("https://youtu.be/uQ9J591NmAQ?si=eETS-tbiGhrxfZ3C&t=92", "_blank");
  }
  login() {
    const body = {
      email: this.email,
      password: this.password,
    };

    this.http.post('https://superlogically-unadministered-karyl.ngrok-free.dev/api/login', body).subscribe({
      next: (res: any) => {
        alert('Login success');

        console.log(res);

        // บันทึก user
        localStorage.setItem('user', JSON.stringify(res.user));

        // ไปหน้า dashboard
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
        alert('Email หรือ Password ไม่ถูกต้อง');
      },
    });
  }
  
}
