import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  products: any[] = [];
  selectedFile: File | null = null;
  categories: any[] = [];
  // ── Search ───────────────────────────────
  searchQuery = '';

  get filteredProducts() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
    );
  }

  // ── Modal state ──────────────────────────
  showAddModal = false;
  showEditModal = false;
  editingItem: any = null;

  form: {
    image: string;
    name: string;
    description: string;
    code: string;
    categoryId: number | null;
    price: number | null;
    cost: number | null;
    stock: number | null;
  } = {
    image: '',
    name: '',
    description:'',
    code: '',
    categoryId: null,
    price: null,
    cost: null,
    stock: null,
  };

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories(); // ⭐ เพิ่มอันนี้
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url === '/inventory') {
        this.loadProducts();
      }
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  loadCategories() {
    const options = {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    };

    this.http
      .get<
        any[]
      >('https://superlogically-unadministered-karyl.ngrok-free.dev/api/getCategory', options)
      .subscribe({
        next: (res) => {
          console.log('CATEGORIES:', res);
          this.categories = res;

          this.cd.detectChanges(); // ⭐ เพิ่มตรงนี้ด้วย
        },
        error: (err) => console.error('CATEGORY ERROR:', err),
      });
  }
  
loadProducts() {
  const BASE_URL = 'https://superlogically-unadministered-karyl.ngrok-free.dev';

  const options = {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  };

  this.http
    .get<any[]>(`${BASE_URL}/api/products`, options)
    .subscribe({
      next: (res) => {
        this.products = res.map((p) => {
          let imageUrl = null;

          if (p.image) {
            if (p.image.startsWith('http')) {
              imageUrl = p.image;
            } else {
              imageUrl = `${BASE_URL}/uploads/${p.image}`;
            }
          }

          return {
            id: p.id,
            code: p.barcode,
            name: p.name,
            category: p.category?.name || 'ไม่มีหมวดหมู่',
            categoryId: p.categoryId,
            stock: p.stock,
            unit: 'ชิ้น',
            price: p.price,
            cost: p.cost,
            image: imageUrl, // ✅ ใช้ตัวที่เราคำนวณ
            status: p.stock > 20 ? 'normal' : p.stock > 0 ? 'low' : 'out',
          };
        });

        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
}
  // ── Delete ───────────────────────────────
deleteProduct(item: any) {
  if (!confirm(`ยืนยันการลบ "${item.name}" ?`)) return;

  const BASE_URL = 'https://superlogically-unadministered-karyl.ngrok-free.dev';

  const options = {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  };

  this.http
    .delete(`${BASE_URL}/api/products/${item.id}`, options)
    .subscribe({
      next: () => {
        // 🔥 ลบใน UI ทันที
        this.products = this.products.filter((p) => p.id !== item.id);
            this.cd.detectChanges();
      },
      error: (err) => console.error('DELETE ERROR:', err),
    });
}

  // ── Open / Close Modal ───────────────────
  openAddModal() {
    this.form = {
      name: '',
      description:'',
      code: '',
      categoryId: null,
      price: null,
      stock: null,
      cost: null,
      image: '',
    };

    this.showAddModal = true;
  }

  openEditModal(item: any) {
    this.editingItem = item;

    this.form = {
      name: item.name,
      description: item.description,
      code: item.code,
      categoryId: item.categoryId, // ⭐ ต้องมีจาก backend
      price: item.price,
      cost: item.cost,
      stock: item.stock,
      image: item.image || '',
    };

    this.showEditModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
  }

  // ── Save ─────────────────────────────────
  saveAdd() {
    const { name, code, categoryId,description, price,cost, stock } = this.form;

    if (!name || !code || categoryId == null || price == null || stock == null) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', String(price)); // ⭐ ใช้ String() ดีกว่า
    formData.append('cost', String(cost));
    formData.append('barcode', code);
    formData.append('description', String(description));
    formData.append('categoryId', String(categoryId));
    formData.append('stock', String(stock));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    const options = {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    };
    this.http
      .post(
        'https://superlogically-unadministered-karyl.ngrok-free.dev/api/products',
        formData,
        options,
      )
      .subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error(err),
      });
  }
saveEdit() {
  const { name, code, categoryId,description, price,cost, stock } = this.form;

  if (!name || !code || !categoryId || price == null || stock == null) {
    alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    return;
  }

  const BASE_URL = 'https://superlogically-unadministered-karyl.ngrok-free.dev';

  const body = {
    name,
    description,
    barcode: code,
    categoryId,
    price,
    cost,
    stock,
    
  };

  const options = {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  };

  this.http
    .put(`${BASE_URL}/api/products/${this.editingItem.id}`, body, options)
    .subscribe({
      next: () => {
        this.loadProducts(); // 🔥 reload ใหม่จาก DB
        this.closeModal();
      },
      error: (err) => console.error('UPDATE ERROR:', err),
    });
}
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=No+Img';
  }
}
