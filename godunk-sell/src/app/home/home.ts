import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../services/product';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  filteredProducts: any[] = [];
  products: any[] = [];

  constructor(
    private productService: Product,
    private cd: ChangeDetectorRef,
    private cartService: CartService,
    private searchService: SearchService,
  ) {}

  ngOnInit(): void {
    console.log('HOME INIT');
    this.loadProducts();
    this.searchService.search$.subscribe((keyword) => {
      const k = keyword.toLowerCase();

      this.filteredProducts = this.products.filter((p) => p.name.toLowerCase().includes(k));
    });
  }
  addToCart(product: any) {
    if (product.stock > 0) {
    this.cartService.addToCart(product);
    alert('เพิ่มลงตะกร้าแล้ว');
  }else{
    alert('ขออภัย สินค้าชิ้นนี้หมดแล้ว');
  }
  }
  loadProducts() {
    this.productService.getProducts().subscribe((res) => {
      console.log(res);

      this.products = [...res];
      this.filteredProducts = [...res];
      this.cd.detectChanges(); // สำคัญ
    });
  }
}
