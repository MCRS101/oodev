import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: any[] = [];
  remove(item: any) {
    this.cart = this.cart.filter((p) => p.id !== item.id);
  }
  addToCart(product: any) {
    const item = this.cart.find((p) => p.id === product.id);

    if (item) {
      item.qty++;
    } else {
      this.cart.push({
        ...product,
        qty: 1,
      });
    }
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
getTotalQty(){
  return this.cart.reduce((sum:any, item:any)=>{
    return sum + item.qty
  },0)
}

}
