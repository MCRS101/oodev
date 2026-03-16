import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface DashboardOrder {
  po: number;
  customer: string;
  date: string;
  total: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  orders: DashboardOrder[] = [];
  latestOrders: DashboardOrder[] = [];

  waitingCount = 0;
  shippingCount = 0;
  monthlyTotal = 0;

  loading = false;
  errorMessage = '';
  latestMonthLabel = '';

  private apiUrl =
    'https://superlogically-unadministered-karyl.ngrok-free.dev/api/getorder';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(this.apiUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    }).subscribe({
      next: (res) => {
        this.orders = (res || []).map((o) => ({
          po: Number(o.po ?? o.id ?? 0),
          customer: o.customer ?? o.user?.name ?? '-',
          date: o.date ?? o.createdAt ?? '',
          total: Number(o.total ?? 0),
          status: (o.status ?? '').trim(),
        }));

        this.calculateSummary();
        this.loading = false;
        this.cdr.detectChanges();

        console.log('dashboard orders:', this.orders);
        console.log('latestMonthLabel:', this.latestMonthLabel);
        console.log('waitingCount:', this.waitingCount);
        console.log('shippingCount:', this.shippingCount);
        console.log('monthlyTotal:', this.monthlyTotal);
        console.log('latestOrders:', this.latestOrders);
      },
      error: (error) => {
        console.error('โหลดข้อมูล dashboard ไม่สำเร็จ', error);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลแดชบอร์ดได้';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateSummary(): void {
    if (!this.orders.length) {
      this.waitingCount = 0;
      this.shippingCount = 0;
      this.monthlyTotal = 0;
      this.latestOrders = [];
      this.latestMonthLabel = '';
      return;
    }

    const validOrders = this.orders.filter((order) => {
      const d = new Date(order.date);
      return !isNaN(d.getTime());
    });

    if (!validOrders.length) {
      this.waitingCount = 0;
      this.shippingCount = 0;
      this.monthlyTotal = 0;
      this.latestOrders = [];
      this.latestMonthLabel = '';
      return;
    }

    const sortedOrders = [...validOrders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestDate = new Date(sortedOrders[0].date);
    const latestMonth = latestDate.getMonth();
    const latestYear = latestDate.getFullYear();

    const latestMonthOrders = validOrders.filter((order) => {
      const d = new Date(order.date);
      return (
        d.getMonth() === latestMonth &&
        d.getFullYear() === latestYear
      );
    });

    this.latestMonthLabel = new Intl.DateTimeFormat('th-TH', {
      month: 'long',
      year: 'numeric',
    }).format(latestDate);

    this.waitingCount = latestMonthOrders.filter(
      (order) => this.normalizeStatus(order.status) === 'รอจัดส่ง'
    ).length;

    this.shippingCount = latestMonthOrders.filter(
      (order) => this.normalizeStatus(order.status) === 'กำลังจัดส่ง'
    ).length;

    this.monthlyTotal = latestMonthOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    this.latestOrders = [...latestMonthOrders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }

  normalizeStatus(status: string): string {
    return (status || '').trim();
  }

  getStatusClass(status: string): string {
    const normalized = this.normalizeStatus(status);

    if (normalized === 'รอจัดส่ง') return 'status-waiting';
    if (normalized === 'กำลังจัดส่ง') return 'status-shipping';
    if (normalized === 'จัดส่งแล้ว') return 'status-success';

    return '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH').format(Number(amount) || 0);
  }

  formatOrderCode(po: number): string {
    return `PO-${po}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  goToOrders(): void {
    this.router.navigate(['/purchase-order']);
  }
}