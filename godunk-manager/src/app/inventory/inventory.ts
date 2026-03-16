import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
  products: any[] = [];

  // ── Search ───────────────────────────────
  searchQuery = '';

  get filteredProducts() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
    );
  }

  // ── Modal state ──────────────────────────
  showAddModal  = false;
  showEditModal = false;
  editingItem: any = null;

  form = {
    image: '' as string,
    name: '', code: '', category: '',
    price: null as number | null,
    stock: null as number | null,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const options = {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    };
    this.http.get<any[]>(
      'https://superlogically-unadministered-karyl.ngrok-free.dev/api/products',
      options
    ).subscribe((res) => {
      this.products = res.map(p => ({
        id:       p.id,
        code:     p.barcode,
        name:     p.name,
        category: p.category.name,
        stock:    p.stock,
        unit:     'ชิ้น',
        price:    p.price,
        cost:     p.cost,
        image:    p.image,
        status:   p.stock > 20 ? 'normal' : p.stock > 0 ? 'low' : 'out',
      }));
    });
  }

  // ── Delete ───────────────────────────────
  deleteProduct(item: any) {
    if (!confirm(`ยืนยันการลบ "${item.name}" ?`)) return;
    this.products = this.products.filter(p => p !== item);
  }

  // ── Open / Close Modal ───────────────────
  openAddModal() {
    this.form = { name: '', code: '', category: '', price: null, stock: null, image: '' };
    this.showAddModal = true;
  }

  openEditModal(item: any) {
    this.editingItem = item;
    this.form = { name: item.name, code: item.code, category: item.category, price: item.price, stock: item.stock, image: item.image || '' };
    this.showEditModal = true;
  }

  closeModal() {
    this.showAddModal  = false;
    this.showEditModal = false;
  }

  // ── Save ─────────────────────────────────
  saveAdd() {
    const { name, code, category, price, stock } = this.form;
    if (!name || !code || !category || price == null || stock == null) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง'); return;
    }
    this.products.push({
      code, name, category,
      stock: stock!,
      unit: 'ชิ้น',
      price: price!,
      status: stock! > 20 ? 'normal' : stock! > 0 ? 'low' : 'out',
    });
    this.closeModal();
  }

  saveEdit() {
    const { name, code, category, price, stock } = this.form;
    if (!name || !code || !category || price == null || stock == null) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง'); return;
    }
    Object.assign(this.editingItem, {
      image: this.form.image,
      name, code, category, price: price!, stock: stock!,
      status: stock! > 20 ? 'normal' : stock! > 0 ? 'low' : 'out',
    });
    this.closeModal();
  }
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=No+Img';
  }
}