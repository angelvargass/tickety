import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'admin',
        data: {
          authorities: [],
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
        path: 'venue',
        loadChildren: () => import('./entities/venue/venue.module').then(m => m.VenueModule),
      },
      {
        path: 'genre',
        loadChildren: () => import('./entities/genre/genre.module').then(m => m.GenreModule),
      },
      {
        path: 'artist',
        loadChildren: () => import('./entities/artist/artist.module').then(m => m.ArtistModule),
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
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
