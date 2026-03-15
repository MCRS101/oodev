import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css' 
})
export class Home implements OnInit {  // <--- แก้ไขชื่อคลาสกลับเป็น Home ให้ตรงกับ Routing
  // ตัวแปรเก็บข้อมูล
  transactions: any[] = [];
  totalIncome: number = 0;
  totalExpense: number = 0;
  netBalance: number = 0;

  ngOnInit(): void {
    // ข้อมูลจำลอง (ถ้าจะดึง API ค่อยเปลี่ยนตรงนี้ทีหลังครับ)
    this.transactions = [
      { date: '11 มี.ค. 2026', type: 'รายรับ', detail: 'ขายสินค้าให้ ลูกค้าเอ', amount: 45000, status: 'เรียบร้อย' },
      { date: '10 มี.ค. 2026', type: 'รายจ่าย', detail: 'Manager สั่งของจาก Supplier B', amount: 22000, status: 'รอจ่ายเงิน' }
    ];

    this.calculateTotals();
  }

  // ฟังก์ชันคำนวณยอดรวม
  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'รายรับ')
      .reduce((sum, current) => sum + current.amount, 0);

    this.totalExpense = this.transactions
      .filter(t => t.type === 'รายจ่าย')
      .reduce((sum, current) => sum + current.amount, 0);

    this.netBalance = this.totalIncome - this.totalExpense;
  }
}