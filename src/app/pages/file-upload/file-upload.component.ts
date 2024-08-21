import { Component, OnInit } from '@angular/core';
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
export class FileUploadComponent implements OnInit {

  files: { name: string, url: string,  description:string}[] = [];
  session: Session | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  userUuid: string = "";
  private pollingInterval: any = null; // Para manejar el intervalo de reintentos
  newFiles: number = 0;
  firstLoad: boolean = true;

  constructor(
    private uploadFilesService: UploadFilesService,
    private readonly authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.sessionChanges.subscribe(session => {
      this.session = session;
      if (session) {
        this.loadData();
      }
    });
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    this.cdr.detectChanges();
  }

  async uploadFile(): Promise<void> {
    if (this.selectedFile) {
      this.firstLoad = false;
      this.isLoading = true;
      this.cdr.detectChanges();
      try {
        await this.uploadFilesService.uploadFile(this.selectedFile);
        this.selectedFile = null;
        this.startPolling(); // Inicia el intervalo de reintentos
      } catch (error) {
        console.error('Error uploading file:', error);
        this.isLoading = false;
      }
    } else {
      console.warn('No file selected.');
    }
  }

  private startPolling() {
    this.pollingInterval = setInterval(async () => {
      await this.loadData();
    }, 5000); // Reintentar cada 5 segundos
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      const data = await this.uploadFilesService.getDataByUserUuid();
      this.files = data;
      console.log("files: ", this.files);
      this.cdr.detectChanges();

      if (!this.firstLoad) {

        if (this.files.length == this.newFiles) {
          console.log("No new files yet.");
        }else{
          this.stopPolling(); // Detener el intervalo una vez que se hayan cargado los datos
          console.log("ciclo de carga detenida");
          this.isLoading = false;
          this.newFiles = this.files.length + 1;
        }

      }else{
        this.newFiles = this.files.length;
        this.isLoading = false;
      }

    } catch (error) {
      console.error('Error loading files:', error);
      this.isLoading = false;
    }
  }
}
