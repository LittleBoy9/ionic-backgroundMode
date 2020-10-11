import { Component, OnInit } from '@angular/core';
import { ParentstudentService } from '../../parentstudent/parentstudent.service';
import { interval,Subscription } from 'rxjs';
import { Noticeboard } from '../../parentstudent/noticeboard.model';
import {  Platform } from '@ionic/angular';
import { AdminService } from '../../admin.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import {
       NavController,
       LoadingController,
       AlertController
    } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

/*@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})*/
export class DashboardPage implements OnInit {
  mobile = false;
  isLoading = false;
  showLoaderCount = false;
  loadnotice: Noticeboard[];
  topnotice = [];
  private noticesub: Subscription;
  UserType: string;
  Name: any;
  
  intervalId: number;
  subscription: Subscription;
  
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private AdminService: AdminService,
     private ParentstudentService: ParentstudentService, private Platform: Platform, 
     private router: Router,
     private plt: Platform,
     private localNotifications: LocalNotifications,
     private alertCtrl: AlertController) {

       /*this.plt.ready().then(() =>{
              this.localNotifications.on('click').subscribe( res => {
                 console.log('click :', res);
                 let msg = res.data ? res.data.mydata : '';
                 this.showAlert(res.title, res.text, msg);
              });
              this.localNotifications.on('trigger').subscribe( res => {
                console.log('click :', res);
                let msg = res.data ? res.data.mydata : '';
                this.showAlert(res.title, res.text, msg);
              });
          });*/
      }
  slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }
       $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
           if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            // tslint:disable-next-line: max-line-length
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            // tslint:disable-next-line: max-line-length
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) { shadowBefore[0].style.opacity = Math.max(-progress, 0); }
            if (shadowAfter.length) { shadowAfter[0].style.opacity = Math.max(progress, 0); }
          }
          $slideEl
            .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    },
    autoplay: true,
    speed: 500,
    zoom: {
      maxRatio: 5
    }
  };

  ngOnInit() {
    
	
	/*const source = interval(18000);
	this.subscription = source.subscribe(val => this.everyMin());
*/
    const displayname = JSON.parse(localStorage.getItem('_cap_authData')).displayName;
    this.UserType = String(displayname).split('|')[0];
    console.log(this.UserType );
    if(   this.UserType == 'V'){
      this.router.navigateByUrl('/stvideo');
    }
    if (this.Platform.is('mobile')) {
      this.mobile = true;
    }
    this.showLoaderCount  = true;

   this.getName();


    this.AdminService.getDataOnlyValue('/noticeboard', 'notice_id').subscribe( res => {
  

     // this.loadnotice = res,
    //  this.topnotice = this.loadnotice.sort((a, b) => b.timestamp - a.timestamp);
    this.topnotice = res;
    this.topnotice =  this.topnotice .sort(this.custom_sort);
    this.loadnotice =   this.topnotice.slice(0 , 10);
      console.log(this.topnotice);
    },
      e => {
        return console.error(e);
      });
  }

     custom_sort(a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

  public getColor(index: number): string {
    switch (index) {
      case 0 : return '#00203FFF';
      case 1 : return '#AE0E36FF';
      case 2 : return '#606060FF';
      case 3 : return '#990011FF';
      case 4 : return '#2C5F2D';
      case 5 : return '#078282FF';
      case 6 : return '#00539CFF';
      case 7 : return '#00A4CCFF';
      case 8 : return '#184A45FF';
      case 9 : return '#101820FF';
      default: return '#606060FF';
    }
  }
getName(){
  let StudentIDs =  JSON.parse(localStorage.getItem('_cap_authData')).email;
  let mailtype;
  if (JSON.parse(localStorage.getItem('_cap_authData')).displayName.indexOf('S') != -1) {
    mailtype = 'email';
  } else {
    mailtype = 'femail';
  }
 console.log(mailtype);
console.log(StudentIDs.trim().toString());
      this.AdminService.getDataforValue( '/student', mailtype, StudentIDs.trim()).subscribe(res => {
        console.log(res);
        if (JSON.parse(localStorage.getItem('_cap_authData')).displayName.indexOf('S') != -1) {
        this.Name = res[0]['name'];
        } else  {
          console.log('inside else ');
          this.Name = res[0]['father_name'];
        }
        console.log(this.Name);
      });
}


/*    everyMin(){
      let notification_data = [];
      this.AdminService.getDataOnlyValue_1('/notification', 'notification_id').subscribe(Data => {
       

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

 ////   const __data = {
            'recieved_notification': 
        }
        this.AdminService.pushDataWithOut_id(__data,'/recieved_notification').then( state => {
          console.log(state) ;              
        }).catch((err) => {            
            console.log(err);
        });  ////////
                
      } , errResdata => {       
        const message = errResdata.error.error.message;
        console.log(message)
      });
      
      
      

    }*/

    private showAlert(header, sub, message: string) {
    this.alertCtrl
      .create({
        header: header,
        subHeader: sub,
        message: message,
        buttons: ['Okay']
      }).then(alertEl => alertEl.present());
    }
	
	ngOnDestroy(){
		this.subscription && this.subscription.unsubscribe();
	}
}
