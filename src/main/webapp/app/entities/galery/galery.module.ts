import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GaleryComponent } from './list/galery.component';
import { GaleryDetailComponent } from './detail/galery-detail.component';
import { GaleryUpdateComponent } from './update/galery-update.component';
import { GaleryDeleteDialogComponent } from './delete/galery-delete-dialog.component';
import { GaleryRoutingModule } from './route/galery-routing.module';

@NgModule({
  imports: [SharedModule, GaleryRoutingModule],
  declarations: [GaleryComponent, GaleryDetailComponent, GaleryUpdateComponent, GaleryDeleteDialogComponent],
})
export class GaleryModule {}
