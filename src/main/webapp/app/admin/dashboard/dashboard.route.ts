import { Route } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

export const dashboardRoute: Route = {
  path: '',
  component: DashboardComponent,
  data: {
    pageTitle: 'Admin dashboard',
  },
};
