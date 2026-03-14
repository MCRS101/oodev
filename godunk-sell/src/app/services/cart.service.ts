import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CartService {

    constructor(private http: HttpClient) {}
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
checkout(userId:number){

    const payload = {
      userId: userId,
      items: this.cart.map(item => ({
        productId: item.id,
        qty: item.qty,
        price: item.price
      }))
    }

    return this.http.post("/api/order", payload)

  }

  clearCart(){
    this.cart = []
  }


}
