import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'ticket',
          loadChildren: () => import('./entities/ticket/ticket.module').then(m => m.TicketModule),
        },
        {
          path: 'photo',
          loadChildren: () => import('./entities/photo/photo.module').then(m => m.PhotoModule),
        },
        {
          path: 'galery',
          loadChildren: () => import('./entities/galery/galery.module').then(m => m.GaleryModule),
        },
        {
          path: 'event',
          loadChildren: () => import('./entities/event/event.module').then(m => m.EventModule),
        },
        {
          path: 'ticket',
          loadChildren: () => import('./entities/ticket/ticket.module').then(m => m.TicketModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
