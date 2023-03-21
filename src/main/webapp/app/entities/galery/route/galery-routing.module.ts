import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GaleryComponent } from '../list/galery.component';
import { GaleryDetailComponent } from '../detail/galery-detail.component';
import { GaleryUpdateComponent } from '../update/galery-update.component';
import { GaleryRoutingResolveService } from './galery-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const galeryRoute: Routes = [
  {
    path: '',
    component: GaleryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GaleryDetailComponent,
    resolve: {
      galery: GaleryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GaleryUpdateComponent,
    resolve: {
      galery: GaleryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GaleryUpdateComponent,
    resolve: {
      galery: GaleryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(galeryRoute)],
  exports: [RouterModule],
})
export class GaleryRoutingModule {}
