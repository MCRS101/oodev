import { Component } from '@angular/core';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';


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
  receipt:any = null;

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
    private http: HttpClient
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
  checkout(){

  const order = {
    userId: this.user.id,
    location: this.location,
    items: this.cartService.getCart(),
    total: this.cartService.getTotal()
  }

  this.http.post("http://localhost:5000/api/order", order)
  .subscribe((res:any)=>{

 

  


    // เปิด popup ใบเสร็จ
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('receiptModal')
    )
    modal.show()

    // ล้าง cart
    this.cartService.cart = []

  })

}

}
