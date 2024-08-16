import { Component } from '@angular/core';
import { UploadFilesService } from '../../services/upload-files.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class FileUploadComponent {

  files: { name: string, url: string }[] = [];
  session: Session | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  constructor(private uploadFilesService: UploadFilesService, private readonly authService: AuthService, private router: Router,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.authService.sessionChanges.subscribe(session => {
      this.session = session;
      if (session) {
        this.loadFiles();
      }
    });
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    this.cdr.detectChanges();
  }

  async uploadFile(): Promise<void> {
    if (this.selectedFile) {
      this.isLoading = true;
      this.cdr.detectChanges();
      try {
        const response = await this.uploadFilesService.uploadFile(this.selectedFile);
        console.log('File uploaded:', response);
        await this.loadFiles();
        this.selectedFile = null;
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.warn('No file selected.');
    }
  }

  async loadFiles(): Promise<void> {
    this.isLoading = false;
    try {
      const { data, error } = await this.uploadFilesService.getFiles();
      if (error) {
        console.error('Error loading files:', error);
      } else {
        this.files = data.map(file => {
          const url = this.uploadFilesService.getPublicUrl(file.name);
          return { name: file.name, url: url };
        });
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

}
