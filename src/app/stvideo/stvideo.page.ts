import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { StvideoService } from './stvideo.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from '@angular/fire/database';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import {
  NavController,
  LoadingController
} from '@ionic/angular';
@Component({
  selector: 'app-stvideo',
  templateUrl: './stvideo.page.html',
  styleUrls: ['./stvideo.page.scss'],
})
export class StvideoPage implements OnInit
{
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  cols: any[];
	isLive:boolean = true;
  days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  selectedDay: any;
  particularDayData: any ;
  allData  = [];
  studentClass;
  isLoading: boolean;
  studentName: any;
  sub_type: any;
  videoData = [];
  finalVideo = [];
  liveData = [];
  live_Video = [];
  private route: ActivatedRoute
  StudentIDs;
  notesData =[];
  finalNotes =[];
  pdfUrl: string;
  visitor: boolean;

 

  constructor( private authService: AuthService,
   public sanitizer: DomSanitizer , 
     private _stvideo:StvideoService, 
     private loadingCtrl: LoadingController,
      private alertCtrl: AlertController,
     private db: AngularFireDatabase ,private iab: InAppBrowser) { 
  
     }

  ngOnInit() { 

    this.loadData();  
    //this.getLive();
  }
  ionViewWillEnter() {
    this.loadData();  
  }

/*  video = [
    {
      videoLink : 'https://www.youtube.com/embed/7-15RIJyKXA'
    },
    {
      videoLink : 'https://www.youtube.com/embed/7-15RIJyKXA'
    },
    {
      videoLink : this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/7-15RIJyKXA')
    }
  ]*/
  youtube_Video = [
    /*{
      class_id: '',
      description: '',
      link: 'https://www.youtube.com/embed/k6jRIslnK5c',
      link_id: '',
      subject_id: '',
      title: 'EDITORIAL DISCUSSION '
    },
    */
  ]
  live = [
    {
        liveLink : this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/7-15RIJyKXA')
    }
  ]

  onFetchData()
  {
    this.loadData();
      this._stvideo.fetchData().subscribe(
          (response) => console.log(response),
          (err) => console.log("eroooorrrrr !!!!!!!"+err)
      )
  }

  loadData() {
    this.isLoading = true;
    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Loading...'})
    .then(loadingEl => {
      loadingEl.present();
  this.StudentIDs =  JSON.parse(localStorage.getItem('_cap_authData')).email;
console.log(this.StudentIDs);
let table;
if (JSON.parse(localStorage.getItem('_cap_authData')).displayName.indexOf('V') != -1) {
table = '/registered';
this.visitor = true;
} else {
  table = '/student';
  this.visitor = false;
}
    this._stvideo.studentName(this.StudentIDs.trim() , table).subscribe(res => {
      console.log(res);
      this.studentName = res[0]['name'];
      this.studentClass = res[0]['class_id'];
      this.getVideo();
      this.getNotes();
      this._stvideo.ClassRoutine( res[0]['class_id']).subscribe(res => {
        //      console.log(res);
                   this.allData = res;
                   this.selectedDay = 'MON';
                   this.fliterData('Monday');
                   loadingEl.dismiss();
       //            console.log(this.particularDayData);
             }, errResdata => {
                   this.isLoading = false;
                   loadingEl.dismiss();
                   const message = errResdata.error.error.message;
                   this.showAlert(message);
             });
  });
});
}

 
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Unable to Load Data',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
  
  hourFrom24To12(value){
     let hours = value.split(':')[0];
     const Minus = value.split(':')[1];
      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours === 0 ? '12' : hours > 12 ? hours - 12 : hours;
       const time  = hours + ':' + Minus + suffix;
       return time;

}
  fliterData(day: string) {
    this.particularDayData = [];
//    console.log(this.allData);
    for (let i = 0; i < this.allData.length; i++) {
      // tslint:disable-next-line: triple-equals
      if (this.allData[i]['day'].toUpperCase() == day.toUpperCase()) {
      //  console.log('Subject-id'+ this.allData[i]['subject_id']);

        this.sub_type = this.allData[i]['subjectType'];
      
      //  console.log(this.sub_type);
        if(this.sub_type =="Main"){
          this._stvideo.subjectName(this.allData[i]['subject_id']).
            subscribe(resdata => {
//              console.log(resdata);
            //  console.log(this.allData[i]['subjectType']);
              this.particularDayData.push({
              'subject': resdata[0]['name'],
              'start' : this.hourFrom24To12(this.allData[i]['start_time']),
              'end' : this.hourFrom24To12(this.allData[i]['end_time']),/*+ ':' + this.allData[i]['time_end_min'] + ' ' + this.allData[i]['starting_ampm'],*/
              'subjectType' : this.allData[i]['subjectType'],
            });
          });
        }
        else{
          this._stvideo.optionalSubjectName(this.allData[i]['subject_id']).
            subscribe(resdata => {
            //   console.log(resdata);
            //  console.log(this.allData[i]['subjectType']);
              this.particularDayData.push({
              'subject': resdata[0]['name'],
              'start' : this.hourFrom24To12(this.allData[i]['start_time']),
              'end' : this.hourFrom24To12(this.allData[i]['end_time']),/*+ ':' + this.allData[i]['time_end_min'] + ' ' + this.allData[i]['starting_ampm'],*/
              'subjectType' : this.allData[i]['subjectType'],
            });
          });
        }
      }
    }
  }
 
  open_routine() {
      this._stvideo.fetchData().subscribe(
          (response) => {
           // console.log(response);
           // const data = JSON.stringify(response);
          //  console.log(data);
          },
          (err) => console.log("erooorrr !!"+err)
      )
  }
  open(day) {
//    console.log('day'+day);
    this.selectedDay = this.days[day];
      let dayName ;
      switch (day) 
      {
            case 0:
                dayName = 'Monday';
                break;
            case 1:
                dayName = 'Tuesday';
                break;
            case 2:
                dayName = 'Wednesday';
                break;
            case 3:
                dayName = 'Thursday';
                break;
            case 4:
                dayName = 'Friday';
                break;
            case 5:
                dayName = 'Saturday';
                break;
            case 6:
                dayName = 'Sunday';
                break;
        }
      //  console.log(dayName);
        this.open_routine();
        //console.log('day' + dayName);
    this.fliterData(dayName);
//    console.log( this.particularDayData);
  }
    getVideo(){
      this._stvideo.getDataforValuewithID('/tut_video' , 'class_id',this.studentClass).subscribe(
      
        (video_response) => {
          this.finalVideo = video_response;
          this.finalVideo = [];
          if(video_response.length>0){
          this.videoData = video_response;
          for (let j = 0; j < this.videoData.length; j++) {
            const data =  this.videoData[j].payload.val();
            const id =  this.videoData[j].payload.key;

            let classId = this.videoData[j]['class_id']
            let link = this.videoData[j]['link']
            let title = this.videoData[j]['title']
            console.log(data['link']);
            const videoId = data['link'].split('embed/')[1].split('?version=3')[0]
            this.finalVideo.push({
              'title': data['title'],
              'link': this.sanitizer.bypassSecurityTrustResourceUrl(data['link']),
              'description': data['description'],
              'link_id': data['link_id'],
              'VideoID': videoId,
              'id': id
            });
          }
        }
        },(err) => console.log("error !!!!!!! "+err)
      )
    }

    getNotes(){
     
      this._stvideo.fetchdata(this.studentClass, '/notes').subscribe(
        (notes_response) => {
          if(notes_response.length>0){
          this.notesData = notes_response;
          this.finalNotes = [];
          for (let j = 0; j < this.notesData.length; j++) {
           
            let classId = this.notesData[j]['class_id']
            let link = this.notesData[j]['link']
            let title = this.notesData[j]['title']
            this.finalNotes.push({
              'name': this.notesData[j]['name'],
              'desc': this.notesData[j]['desc'],
              'docDriveId': this.notesData[j]['docDriveId'],
            });

          }
        }
        },(err) => console.log("error !!!!!!! "+err)
      )
    }
    
    getLive(){
      let live_link: any;
      let live_title: any;
      this._stvideo.fetchLiveVideo().subscribe(
        (live_response) => {
           this.liveData = live_response;
           for (let k = 0; k < this.liveData.length; k++){
               live_link = this.liveData[k]['link'];
               live_title = this.liveData[k]['title'];
              this.live_Video.push({
                'title': this.liveData[k]['title'],
                'livelink': this.liveData[k]['link']        
            });
           }
           console.log(live_link)
           console.log(live_title)
        },(err) => console.log("error !!!!!!! "+err)
      )
    }

    showpdf(id) {
      this.pdfUrl  = '';
      console.log('show pdf');
      const options : InAppBrowserOptions={
        location:'no',
        clearcache:'yes',
        clearsessioncache:'yes',
        mediaPlaybackRequiresUserAction:'yes',
        hardwareback:'yes'
      }
      this.pdfUrl = encodeURIComponent('https://drive.google.com/uc?export=view&id='+ id)
     const url =  'https://docs.google.com/viewer?embedded=true&url=' +this.pdfUrl 
     // _blank load its own page && System use inbulit feature like google drive
    // const browser = this.iab.create( url,'_blank', options); 
    const browser = this.iab.create( url,'_system', options);
    
  }
  // Downloadpdf(id){
  //   this.pdfUrl = encodeURIComponent('https://drive.google.com/uc?export=view&id='+ id)
  //   window.open(this.pdfUrl, '_system', 'location=yes')
  // }

   loadDataInfinite(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    //   if (data.length == 1000) {
    //     event.target.disabled = true;
    //   }
     }, 500);
  }

 
}
