import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from 'cloudinary-core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'jhi-cloudinary',
  templateUrl: './cloudinary.component.html',
  styleUrls: ['./cloudinary.component.scss'],
})
export class CloudinaryComponent implements OnInit {
  protected uploader: FileUploader | undefined;
  private cloudinary: Cloudinary;
  constructor() {
    this.cloudinary = new Cloudinary({
      cloud_name: 'dlil9kbyr',
      api_key: '422929563456485',
      api_secret: 'j9Y0JCVzQSHD7uHNzsMMcCQlEzs',
    });
  }

  ngOnInit(): void {}
}
