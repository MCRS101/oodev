import { Component } from '@angular/core';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchText: string = '';
  user: any = null;
  location: string = '';
  receipt: any = null;

  increase(item: any) {
    item.qty++;
  }

  decrease(item: any) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      this.cartService.remove(item);
    }
  }
  constructor(
    private searchService: SearchService,
    public cartService: CartService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const u = localStorage.getItem('user');
    if (u) {
      this.user = JSON.parse(u);
      this.location = this.user.location;
    }
  }

  logout() {
    localStorage.removeItem('user');
    location.reload();
    location.href = '/';
  }
  search() {
    this.searchService.setSearch(this.searchText);
  }

  openCart() {
    console.log(this.cartService.getCart());
  }
  remove(item: any) {
    this.cartService.remove(item);
  }

  checkout() {
    if (this.cartService.getCart().length === 0) {
      alert('ตะกร้าว่าง');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    // ⭐ ล้าง receipt เก่า
    this.receipt = null;

    this.cartService.checkout(userId).subscribe({
      next: (res: any) => {
        const orderId = res.id;

        this.cartService.clearCart();

        // ปิด cart modal
        const modal = document.getElementById('cartModal');
        if (modal) {
          (window as any).bootstrap.Modal.getInstance(modal)?.hide();
        }

        // ⭐ ดึงข้อมูล order ใหม่
        this.http.get(`/api/order/${orderId}`).subscribe((order: any) => {
          console.log('ORDER FROM API:', order);

          this.receipt = order;
          // ⭐ บังคับ Angular render
          this.cdr.detectChanges();
          const modalElement = document.getElementById('receiptModal');

          if (modalElement) {
            const receiptModal = new (window as any).bootstrap.Modal(modalElement);
            receiptModal.show();
          }
        });
      },

      error: () => {
        alert('สั่งซื้อไม่สำเร็จ');
      },
    });
  }
}
