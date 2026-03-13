import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// 1. Import ไฟล์ Routing ที่เราสร้างไว้
import { AppRoutingModule } from './app-routing-module';

// Import Component ต่างๆ ของคุณ
import { App } from './app';
import { Navbar } from './navbar/navbar';
import { Suppli } from './suppli/suppli';
// import HomeComponent และ CustomerpageComponent มาด้วย...

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule, // 2. ต้องใส่ AppRoutingModule ในช่อง imports นี้ด้วยครับ
  ],
  declarations: [
    App,
    Navbar,
    Suppli,
    // ใส่ HomeComponent, CustomerpageComponent ในนี้
  ],
  bootstrap: [App],
})
export class AppModule {}
