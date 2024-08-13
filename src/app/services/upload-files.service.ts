import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://btoyaxlwbnexxppsvmqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0b3lheGx3Ym5leHhwcHN2bXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNzg5MzIsImV4cCI6MjAzNzk1NDkzMn0.SW01gzvFBjTPTvVnKWCf1JLlWgnK4wYvQFqq-IcKl2o';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

@Injectable({
  providedIn: 'root'
})

export class UploadFilesService {

  constructor() { }

  uploadFile(file: File) {
    const filePath = `${Date.now()}_${file.name}`;
    return supabase.storage.from('files').upload(filePath, file);
  }
  
  getFiles() {
    return supabase.storage.from('files').list();
  }

}
