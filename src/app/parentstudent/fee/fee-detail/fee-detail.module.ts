import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeeDetailPage } from './fee-detail.page';
import {ChartModule} from 'primeng/chart';

const routes: Routes = [
  {
    path: '',
    component: FeeDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeeDetailPage]
})
export class FeeDetailPageModule {}
