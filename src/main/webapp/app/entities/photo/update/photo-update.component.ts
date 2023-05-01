import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PhotoFormService, PhotoFormGroup } from './photo-form.service';
import { IPhoto } from '../photo.model';
import { PhotoService } from '../service/photo.service';
import { IGalery } from 'app/entities/galery/galery.model';
import { GaleryService } from 'app/entities/galery/service/galery.service';
import { PhotoStatus } from 'app/entities/enumerations/photo-status.model';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'jhi-photo-update',
  templateUrl: './photo-update.component.html',
  styleUrls: ['./photo-update.component.scss'],
})
export class PhotoUpdateComponent implements OnInit {
  uploader: FileUploader | undefined;
  isSaving = false;
  photo: IPhoto | null = null;
  photoStatusValues = Object.keys(PhotoStatus);
  photoStatusCurrent = PhotoStatus;
  galeriesSharedCollection: IGalery[] = [];
  editForm: PhotoFormGroup = this.photoFormService.createPhotoFormGroup();

  constructor(
    private router: Router,
    protected cloudinary: Cloudinary,
    protected photoService: PhotoService,
    protected photoFormService: PhotoFormService,
    protected galeryService: GaleryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGalery = (o1: IGalery | null, o2: IGalery | null): boolean => this.galeryService.compareGalery(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ photo }) => {
      this.photo = photo;
      if (photo) {
        this.updateForm(photo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest',
        },
      ],
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);

      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    this.isSaving = true;
    const photo = this.photoFormService.getPhoto(this.editForm);
    if (photo.id !== null) {
      this.subscribeToSaveResponse(this.photoService.update(photo));
    } else {
      photo.status = this.photoStatusCurrent.ACTIVE;
      this.subscribeToSaveResponse(this.photoService.create(photo));
      this.router.navigate([`event`]);
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {}

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): boolean {
    this.isSaving = false;
    return this.isSaving;
  }

  protected updateForm(photo: IPhoto): void {
    this.photo = photo;
    this.photoFormService.resetForm(this.editForm, photo);

    this.galeriesSharedCollection = this.galeryService.addGaleryToCollectionIfMissing<IGalery>(this.galeriesSharedCollection, photo.galery);
  }

  protected loadRelationshipsOptions(): void {
    this.galeryService
      .query()
      .pipe(map((res: HttpResponse<IGalery[]>) => res.body ?? []))
      .pipe(map((galeries: IGalery[]) => this.galeryService.addGaleryToCollectionIfMissing<IGalery>(galeries, this.photo?.galery)))
      .subscribe((galeries: IGalery[]) => (this.galeriesSharedCollection = galeries));
  }
}
