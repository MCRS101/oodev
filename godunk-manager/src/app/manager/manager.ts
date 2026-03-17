import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manager',
  standalone: false,
  templateUrl: './manager.html',
  styleUrl: './manager.css',
})
export class Manager {
formData = {
    username: '',
    total: ''
  };

  selectedFile!: File;
  previewUrl: any = null;

  constructor(private http: HttpClient) {}

  // เลือกรูป
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // preview
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // submit
  submit() {
    const formData = new FormData();

    formData.append('username', this.formData.username);
    formData.append('total', this.formData.total);

    // 👇 สำคัญ: ต้องตรงกับ backend
    if (this.selectedFile) {
      formData.append('file', this.selectedFile); 
    }

    this.http.post('https://superlogically-unadministered-karyl.ngrok-free.dev/api/manager', formData)
      .subscribe({
        next: (res: any) => {
          console.log('SUCCESS:', res);
          alert('บันทึกสำเร็จ');

          // reset
          this.formData = { username: '', total: '' };
          this.previewUrl = null;
        },
        error: (err) => {
          console.error('ERROR:', err);
          alert('เกิดข้อผิดพลาด');
        }
      });
  }
}