import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// อย่าลืม import Component ของคุณด้วยนะ
import { Home } from './home/home'; 
import { Customerpage } from './customerpage/customerpage';
import { Suppli } from './suppli/suppli';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  
  // ตรงคำว่า 'customer' ต้องสะกดให้ตรงกับ routerLink="/customer"
  { path: 'customer', component: Customerpage }, 
  {path: 'supplier', component: Suppli}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] //ไม่มี จะกดปุ่มไม่ได้
})
export class AppRoutingModule { }