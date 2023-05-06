import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventComponent } from './list/event.component';
import { EventDetailComponent } from './detail/event-detail.component';
import { EventUpdateComponent } from './update/event-update.component';
import { EventDeleteDialogComponent } from './delete/event-delete-dialog.component';
import { EventRoutingModule } from './route/event-routing.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { GlobalDashboardsComponent } from './global-dashboards/global-dashboards.component';

@NgModule({
  imports: [SharedModule, EventRoutingModule, NgxPayPalModule],
  declarations: [
    EventComponent,
    EventDetailComponent,
    EventUpdateComponent,
    EventDeleteDialogComponent,
    DashboardsComponent,
    GlobalDashboardsComponent,
  ],
})
export class EventModule {}
