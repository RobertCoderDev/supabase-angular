import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class UploadFilesService {

  private supabase = this.authService.getClient();

  constructor(private authService: AuthService) { }

  async uploadFile(file: File): Promise<any> {
    const userId = this.authService.getUserId();
    const cleanedFileName = this.cleanFileName(file.name);
    const filePath = `users/${userId}/${Date.now()}_${cleanedFileName}`;
    console.log("file path", filePath);

    return this.supabase.storage.from('files').upload(filePath, file);
  }

  private cleanFileName(fileName: string): string {
    return fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '_');
  }

  getFiles() {
    const userId = this.authService.getUserId();
    return this.supabase.storage.from('files').list(`users/${userId}`);
  }

  getPublicUrl(fileName: string) {
    const userId = this.authService.getUserId();
    const { data } = this.supabase.storage.from('files').getPublicUrl(`users/${userId}/${fileName}`);
    return data.publicUrl;
  }


    async getDataByUserUuid(): Promise<any> {
      const userId = this.authService.getUserId();
      const { data, error } = await this.supabase
        .from('files_db')
        .select('*')
        .eq('user_uuid', userId);

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }

      return data;
    }

}
