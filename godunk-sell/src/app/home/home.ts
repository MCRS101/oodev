import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../services/product';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {


  products:any[] = []

  constructor(private productService: Product,
   
  private cd: ChangeDetectorRef
  ){}

  ngOnInit(): void {
      console.log("HOME INIT")
    this.loadProducts()
  }

  loadProducts(){
  this.productService.getProducts()
  .subscribe(res=>{
    console.log(res)

    this.products = [...res]   
    this.cd.detectChanges()// สำคัญ
  })
}

}