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
    ]),
  ],
})
export class EntityRoutingModule {}
