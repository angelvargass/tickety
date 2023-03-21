import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VenueComponent } from '../list/venue.component';
import { VenueDetailComponent } from '../detail/venue-detail.component';
import { VenueUpdateComponent } from '../update/venue-update.component';
import { VenueRoutingResolveService } from './venue-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const venueRoute: Routes = [
  {
    path: '',
    component: VenueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VenueDetailComponent,
    resolve: {
      venue: VenueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VenueUpdateComponent,
    resolve: {
      venue: VenueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VenueUpdateComponent,
    resolve: {
      venue: VenueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(venueRoute)],
  exports: [RouterModule],
})
export class VenueRoutingModule {}
