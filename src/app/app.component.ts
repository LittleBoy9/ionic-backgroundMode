import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, AlertController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { interval,Subscription } from 'rxjs';


import { AuthService } from './auth/auth.service';

import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { AdminService } from './admin.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;
  StudentIDs: any;
  userData: any = [];
  appLink;
  versionNumber;

  intervalId: number;
  subscription: Subscription;


  recieved_notification_count = 0;
  
  constructor(
    private AdminService: AdminService,
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private plt: Platform,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode
  ) {

      this.plt.ready().then(() =>{
              this.localNotifications.on('click').subscribe( res => {
                 console.log('click :', res);
                 let msg = res.data ? res.data.mydata : '';
                 this.showAlert_notification(res.title, res.text, msg);
              });
              this.localNotifications.on('trigger').subscribe( res => {
                console.log('click :', res);
                let msg = res.data ? res.data.mydata : '';
                this.showAlert_notification(res.title, res.text, msg);
              });
      });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    //console.log(this.backgroundMode.enable());

    this.backgroundMode.enable();

    this.backgroundMode.on('activate').subscribe(() => {
        const source = interval(30000);
        this.subscription = source.subscribe(val => this.everyMin());
    });

    const source = interval(30000);
    this.subscription = source.subscribe(val => this.everyMin());
    //console.log(this.backgroundMode.isActive());   

    console.log("app component")

    /*const source = interval(300000);
    this.subscription = source.subscribe(val => this.everyMin());
*/
   
    
    this.authService.getSetting('AppLink').subscribe(data => this.appLink =data[0]['description'] )
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
   

    const aux: any = document.getElementsByTagName('META');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < aux.length; i++) {
     if (aux[i].name === 'version') {
       this.versionNumber = aux[i].content;
       console.log(this.versionNumber);
       this.authService.getSetting('version').subscribe(data => {
         console.log(data[0]['description'] +'!='+ this.versionNumber)
        if (data[0]['description'] != this.versionNumber){
          console.log('APP NEED TO UPDATE');
          const message = 'Update to procced further';
             this.showAlert(message);
        } else {
          console.log('APP Updated');
        }
       });
      }
    }
  
  }
 

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
    
  }
  getUserName() {
    console.log('inside get user name ');
  this.StudentIDs = this.authService.studentIDFromLocal;
  const email = JSON.parse(localStorage.getItem('_cap_authData')).email;
  let name;
  const arrayCheck = Array.isArray(this.StudentIDs);
  if (this.StudentIDs.length !== 0 && arrayCheck) {

  }

  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Update Required',
        message: message,
        buttons: [ {
          text: 'update',
          role: 'cancel',
          cssClass: 'warning',
          handler: () => {
            window.open(this.appLink , '_system');
            this.showAlert(message);
          }
        }]
      })
      .then(alertEl => alertEl.present());
  }

  everyMin(){
    console.log("app component")
    let notification_data = [];
      this.AdminService.getDataOnlyValue_1('/notification', 'notification_id').subscribe(Data => {
        //console.log(Data)

        for(let i=0;i<Data.length;i++){
          if(Data[i]['status'] == 1){
            notification_data.push({
                'notification_id': Data[i]['notification_id'],
                'title': Data[i]['title'],  
                'text': Data[i]['text'],
                'data': Data[i]['data']                             
            }); 
          }
        }

        console.log(notification_data)

        this.localNotifications.schedule({
          id: 1,
          title: notification_data[0]['title'],
          text: notification_data[0]['text'],
          data: {mydata: notification_data[0]['data']},
          trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND},
          foreground: true               
        });

        console.log("got notification")

        const __data = {
            'recieved_notification': notification_data,
            'count': this.recieved_notification_count++
        }

        console.log(__data)


        this.AdminService.pushDataWithOut_id(__data,'/recieved_notification').then( state => {
          console.log(state) ;              
        }).catch((err) => {            
            console.log(err);
        });
                
      } , errResdata => {       
        const message = errResdata.error.error.message;
        console.log(message)
      });      
      

  }

  private showAlert_notification(header, sub, message: string) {
    this.alertCtrl
      .create({
        header: header,
        subHeader: sub,
        message: message,
        buttons: ['Okay']
      }).then(alertEl => alertEl.present());
    }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }

    this.subscription && this.subscription.unsubscribe();

  }
}
