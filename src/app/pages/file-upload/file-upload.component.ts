import { Component } from '@angular/core';
import { UploadFilesService } from '../../services/upload-files.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true
})
export class FileUploadComponent {
  constructor(private uploadFilesService: UploadFilesService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFilesService.uploadFile(file).then(response => {
        console.log('File uploaded:', response);
      });
    }
  }
}
