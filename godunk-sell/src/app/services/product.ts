import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Product {
  constructor(private http: HttpClient) {}

  getProducts(){
      const options = {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    };
     console.log("CALL API")
    return this.http.get<any[]>("https://superlogically-unadministered-karyl.ngrok-free.dev/api/products",options);
  }

}
