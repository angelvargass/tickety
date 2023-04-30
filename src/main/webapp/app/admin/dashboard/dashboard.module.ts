import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import { dashboardRoute } from './dashboard.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([dashboardRoute])],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
