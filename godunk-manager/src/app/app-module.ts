import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';            // ← เพิ่ม
import { provideHttpClient } from '@angular/common/http'; // ← เพิ่ม

import { Dashboard } from './dashboard/dashboard'; 
import { PurchaseOrder } from './purchase-order/purchase-order';

// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Inventory } from './inventory/inventory';


@NgModule({
  declarations: [
    App,  
    Dashboard,
    PurchaseOrder,
    Inventory,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,        // ← เพิ่ม (แก้ ngModel error ทุก component)
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(), // ← เพิ่ม (แก้ HttpClient ใน PurchaseOrder)
  ],
  bootstrap: [App]
})
export class AppModule { }