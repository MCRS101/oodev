import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// 1. Import ไฟล์ Routing ที่เราสร้างไว้
import { AppRoutingModule } from './app-routing-module';

// Import Component ต่างๆ ของคุณ
import { App } from './app';
import { Navbar } from './navbar/navbar';
import { Suppli } from './suppli/suppli';
import { Customerpage } from './customerpage/customerpage';
// import HomeComponent และ CustomerpageComponent มาด้วย...

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [
    App,
    Navbar,
    Suppli,
    Customerpage
    // ใส่ HomeComponent, CustomerpageComponent ในนี้
  ],
  bootstrap: [App],
})
export class AppModule {}
