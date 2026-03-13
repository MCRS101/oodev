import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Product {
  constructor(private http: HttpClient) {}

  getProducts(){
     console.log("CALL API")
    return this.http.get<any[]>("/api/products");
  }

}
