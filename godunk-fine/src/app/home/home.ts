import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // <--- แก้ไขชื่อคลาสกลับเป็น Home ให้ตรงกับ Routing
  transactions: any[] = [];
  totalIncome: number = 0;
  totalExpense: number = 0;
  netBalance: number = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const incomeApi = 'https://superlogically-unadministered-karyl.ngrok-free.dev/api/getorder';
    const expenseApi = 'https://superlogically-unadministered-karyl.ngrok-free.dev/api/manager';

    const options = {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    };
    forkJoin({
      incomeRes: this.http.get<any[]>(incomeApi, options),
      expenseRes: this.http.get<any[]>(expenseApi, options),
    }).subscribe({
      next: ({ incomeRes, expenseRes }) => {
        console.log('income:', incomeRes);
        console.log('expense:', expenseRes);

        // 🔹 กัน undefined
        const income = (incomeRes || []).map((item) => ({
          date: this.formatDate(item.createdAt),
          type: 'รายรับ',
          detail: `Order #${item.id}`,
          amount: item.total,
          status: 'เรียบร้อย',
          createdAt: item.createdAt,
        }));

        const expense = (expenseRes || []).map((item) => ({
          date: this.formatDate(item.createdAt),
          type: 'รายจ่าย',
          detail: `Manager สั่งสินค้าจาก ${item.username}`,
          amount: item.total,
          status: item.tranwin,
          createdAt: item.createdAt,
        }));

        this.transactions = [...income, ...expense].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        console.log('transactions:', this.transactions);

        this.calculateTotals();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API ERROR:', err);
      },
    });
  }

  // แปลงวันที่
  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter((t) => t.type === 'รายรับ')
      .reduce((sum, current) => sum + current.amount, 0);

    this.totalExpense = this.transactions
      .filter((t) => t.type === 'รายจ่าย')
      .reduce((sum, current) => sum + current.amount, 0);

    this.netBalance = this.totalIncome - this.totalExpense;
  }
}
