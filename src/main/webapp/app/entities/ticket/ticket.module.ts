import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TicketComponent } from './list/ticket.component';
import { TicketDetailComponent } from './detail/ticket-detail.component';
import { TicketUpdateComponent } from './update/ticket-update.component';
import { TicketDeleteDialogComponent } from './delete/ticket-delete-dialog.component';
import { TicketRoutingModule } from './route/ticket-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  imports: [SharedModule, TicketRoutingModule, MatDialogModule, NgxPayPalModule],
  declarations: [TicketComponent, TicketDetailComponent, TicketUpdateComponent, TicketDeleteDialogComponent],
})
export class TicketModule {}
