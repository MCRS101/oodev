import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory {
  products = [
    { code: 'ITM-001', name: 'เหล็กเส้น 12มม.', category: 'วัสดุก่อสร้าง', stock: 500, unit: 'เส้น', status: 'normal' },
    { code: 'ITM-002', name: 'ปูนซีเมนต์ถุง 50กก.', category: 'วัสดุก่อสร้าง', stock: 12, unit: 'ถุง', status: 'low' },
    { code: 'ITM-003', name: 'สีทาบ้าน (สีขาว)', category: 'สีและเคมีภัณฑ์', stock: 0, unit: 'ถัง', status: 'out' },
    { code: 'ITM-004', name: 'แผ่นยิปซัม 120x240', category: 'ฝ้าและผนัง', stock: 150, unit: 'แผ่น', status: 'normal' },
    { code: 'ITM-005', name: 'ท่อ PVC 4 นิ้ว', category: 'ประปา', stock: 85, unit: 'ท่อน', status: 'normal' }
  ];
}