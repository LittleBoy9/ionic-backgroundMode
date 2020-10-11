import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SuperTabsModule } from '@ionic-super-tabs/angular';


import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/primeng';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {SidebarModule} from 'primeng/sidebar';
import {CheckboxModule} from 'primeng/checkbox';
import {ProgressBarModule} from 'primeng/progressbar';
import {MultiSelectModule} from 'primeng/multiselect';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ChartModule} from 'primeng/chart';
import {MessageService} from 'primeng/api';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    HttpClientModule, 
    IonicModule.forRoot(),
    SuperTabsModule.forRoot(),
     AppRoutingModule,
     ChartModule,
     TableModule,
     ToastModule,
     ButtonModule,
     AngularFireStorageModule,
     BrowserAnimationsModule,
     DropdownModule,
     OverlayPanelModule,
     MultiSelectModule,
     DialogModule,
  
     CalendarModule,
     MessageModule,
     SidebarModule,
     ProgressBarModule,
     CheckboxModule,
     PanelModule,
     DynamicDialogModule,
     CardModule,
      ServiceWorkerModule.register('ngsw-worker.js',
     { enabled: environment.production }),
     AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule],
  providers: [
    StatusBar,
    TableModule,
    InAppBrowser,
    SplashScreen,
    MessageService,
    File,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocalNotifications,BackgroundMode
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private db: AngularFireDatabaseModule) {
}
}
