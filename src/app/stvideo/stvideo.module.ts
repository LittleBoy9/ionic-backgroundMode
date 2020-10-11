import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StvideoPage } from './stvideo.page';

import { SuperTabsModule } from '@ionic-super-tabs/angular';

import {OverlayPanelModule} from 'primeng/overlaypanel';

import { StvideoService } from './stvideo.service';
const routes: Routes = [
  {
    path: '',
    component: StvideoPage,
/*    children:[
      { 
        path: 'dashboard', 
  //      loadChildren: 'dashboard/dashboard.module#DashboardPageModule'
      },
      { 
        path: 'archive', 
      //  loadChildren: 'archive/archive.module#ArchivePageModule'
      },
      { 
        path: 'live', 
      //  loadChildren: 'live/live.module#LivePageModule'
      }
    ]
  },
  {
    path: '',
 //   redirectTo: 'stvideo/dashboard',
    pathMatch: 'full'*/
  }
];

@NgModule({
  imports: [
    CommonModule,

    FormsModule,
    IonicModule,
    OverlayPanelModule,
    RouterModule.forChild(routes),
    SuperTabsModule
  //  DashboardPageModule
  ],
  providers: [StvideoService],
  declarations: [StvideoPage]
})
export class StvideoPageModule {}
