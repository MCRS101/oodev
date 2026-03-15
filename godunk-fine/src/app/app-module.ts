import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// 1. Import ไฟล์ Routing ที่เราสร้างไว้
import { AppRoutingModule } from './app-routing-module';

// Import Component ต่างๆ ของคุณ
import { App } from './app';
import { Navbar } from './navbar/navbar';
import { Suppli } from './suppli/suppli';
import { Customerpage } from './customerpage/customerpage';
import { Home } from './home/home';
// import HomeComponent และ CustomerpageComponent มาด้วย...

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [
    App,
    Navbar,
    Suppli,
    Customerpage,
    Home
    // ใส่ HomeComponent, CustomerpageComponent ในนี้
  ],
  bootstrap: [App],
})
export class AppModule {}
