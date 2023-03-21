import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VenueComponent } from './list/venue.component';
import { VenueDetailComponent } from './detail/venue-detail.component';
import { VenueUpdateComponent } from './update/venue-update.component';
import { VenueDeleteDialogComponent } from './delete/venue-delete-dialog.component';
import { VenueRoutingModule } from './route/venue-routing.module';

@NgModule({
  imports: [SharedModule, VenueRoutingModule],
  declarations: [VenueComponent, VenueDetailComponent, VenueUpdateComponent, VenueDeleteDialogComponent],
})
export class VenueModule {}
