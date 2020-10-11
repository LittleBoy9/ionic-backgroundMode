import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParentstudentService } from 'src/app/parentstudent/parentstudent.service';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { StvideoService } from 'src/app/stvideo/stvideo.service';

@Component({
  selector: 'app-timetable-detail',
  templateUrl: './timetable-detail.page.html',
  styleUrls: ['./timetable-detail.page.scss'],
})
export class TimetableDetailPage implements OnInit {
  noDataFound =false;
  classID: any;
  studentName: any;
  allData  = [];
  week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  particularDayData: any ;
  isLoading = false;
  selectedDay: any;
  sub_type: any;


  constructor(private router: Router,
    private route: ActivatedRoute,   private _stvideo:StvideoService, 
    // tslint:disable-next-line: no-shadowed-variable
    private ParentstudentService: ParentstudentService,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.classID = paramMap.get('class_id');
      this.studentName = paramMap.get('studentName');
      });
      this.loadData( );
  }
  
  loadData() {
    this.isLoading = true;
    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Loading...'})
    .then(loadingEl => {
      loadingEl.present();
      console.log(this.classID);
      this._stvideo.ClassRoutine(Number(this.classID)).subscribe(res => {
        this.noDataFound = false;
            console.log(res);
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
  fliterData(day: string) {
    this.particularDayData = [];
//    console.log(this.allData);
this.noDataFound = false;
if(this.allData.length > 0){
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
            this.noDataFound = false;
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
            this.noDataFound = false;
          });
      
        }

      } else {
        this.NodatafoundFn(i);
      }
    }
  } else{
    console.log('inside else ');
    this.noDataFound = true; 
  }
  }


  NodatafoundFn(i){
    console.log((this.allData.length -1) +'=='+ i);
    if((this.allData.length -1) == i){
      console.log(this.particularDayData.length)
      if(this.particularDayData.length == 0) {
        this.noDataFound = true;
        console.log(this.noDataFound);
      }
      
    }
  }
open( day) {
//  console.log('day'+day);
  this.selectedDay = this.week[day];
  let dayName ;
  switch (day) {
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
  //console.log('day' + dayName);
  this.fliterData(dayName);
 // console.log( this.particularDayData);
}
hourFrom24To12(value){
  let hours = value.split(':')[0];
  const Minus = value.split(':')[1];
   const suffix = hours >= 12 ? 'PM' : 'AM';
   hours = hours === 0 ? '12' : hours > 12 ? hours - 12 : hours;
    const time  = hours + ':' + Minus + suffix;
    return time;

}
}
