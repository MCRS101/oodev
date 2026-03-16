import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false // <--- เพิ่มบรรทัดนี้เข้าไปเลยครับ! บังคับให้มันเป็นแบบ Module ปกติ
})
export class App {
  currentPage: string = 'dashboard';

  setPage(pageName: string) {
    this.currentPage = pageName;
  }
}