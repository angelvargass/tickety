import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-account',
        loadChildren: () => import('../entities/user-account/user-account.module').then(m => m.UserAccountModule),
        data: {
          pageTitle: 'userAccount.home.title',
        },
      },
      {
        path: 'organization',
        loadChildren: () => import('../entities/organization/organization.module').then(m => m.OrganizationModule),
        data: {
          pageTitle: 'organization.home.title',
        },
      },
      {
        path: 'contact',
        loadChildren: () => import('../entities/contact/contact.module').then(m => m.ContactModule),
        data: {
          pageTitle: 'contact.home.title',
        },
      },
      {
        path: 'venue',
        loadChildren: () => import('../entities/venue/venue.module').then(m => m.VenueModule),
        data: {
          pageTitle: 'venue.home.title',
        },
      },
    ]),
  ],
})
export class EntityRoutingModule {}
