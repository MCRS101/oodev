import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-purchase-order',
  standalone: false,
  templateUrl: './purchase-order.html',
  styleUrl: './purchase-order.css',
})
export class PurchaseOrder implements OnInit {
  orders: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<any[]>('http://localhost:3000/api/getorder').subscribe((res) => {
      this.orders = res.map((o) => ({
        po: o.id,
        customer: o.user.name,
        date: o.createdAt,
        total: o.total,
        status: o.status,
      }));
      console.log(this.orders);
      this.cdr.detectChanges();
    });
  }
}
