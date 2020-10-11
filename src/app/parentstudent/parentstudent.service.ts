import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Noticeboard } from './noticeboard.model';
import { Invoice } from './invoice.model';
import { AlertController, LoadingController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class ParentstudentService {
  studentloadDone;
  studentNameData = [];
  StudentIDs: any;
  isLoading = false;
  authData = JSON.parse(localStorage.getItem('_cap_authData'));
  baseDBpath;
  constructor(private authService: AuthService,  private alertCtrl: AlertController, private http: HttpClient, private loadingCtrl: LoadingController, private db: AngularFireDatabase) {
    this.setDBpath();
   }

   setDBpath() {
    if(this.authData != undefined && this.authData != null && this.authData != ''){
      this.baseDBpath = this.authData.displayName.split('||')[1];
    }   // else is temporary code to show logo from branch 1 until we didn't have super admin , remove it once You have Super admin
  }

  loadData(): Observable<Noticeboard[]> {
    return this.http.get<Noticeboard[]>( `https://schooldemo-4df2c.firebaseio.com/noticeboard.json`);
  }
  feeDetails(studentid) {
  return this.db.list
  (this.baseDBpath +'/invoice', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
  }
  paymentDetail(studentid) {
    return this.db.list
    (this.baseDBpath +'/payment', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
    }

    ClassRoutine(class_id) {
      return this.db.list
      (this.baseDBpath +'/class_routine', ref => ref.orderByChild('class_id').equalTo(class_id)).valueChanges();
      }
    AttendanceDetail(studentid) {
      return this.db.list
      (this.baseDBpath +'/attendance', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
      }
  studentName(studentid) {
    return this.db.list
    (this.baseDBpath +'/student', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
    }
    subjectName(subjectid) {
      return this.db.list
      (this.baseDBpath +'/subject', ref => ref.orderByChild('subject_id').equalTo(subjectid)).valueChanges();
      }
    exam() {
        return this.db.list
        (this.baseDBpath +'/exam', ref => ref.orderByChild('declare_result').equalTo(1)).valueChanges();
        }
    //HERE WE ARE FETCHING COMPLETE EXAM AND WILL APPLY OPERATIONS LATER ON THIS    
    examMark(examid)  {
      return this.db.list
      (this.baseDBpath +'/mark', ref => ref.orderByChild('exam_id').equalTo(examid)).valueChanges();
    }  



    loadStudents() {
      this.studentNameData = [];
      this.isLoading = true;
      this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading...'})
      .then(loadingEl => {
        loadingEl.present();
    this.StudentIDs = this.authService.studentIDFromLocal;
    console.log( this.StudentIDs );
    const arrayCheck = Array.isArray(this.StudentIDs);
    if (this.StudentIDs.length !== 0 && arrayCheck) {
      new Promise((resolve, reject) => {
      this.StudentIDs.forEach((studentID, index, array) => {
        let insideElse =false
        this.getData(Number(studentID),insideElse,loadingEl , index ,array,resolve)
          });
        }).then(() => {
            this.isLoading = false;
            loadingEl.dismiss();
          }
            );
    } 
  });
  }
  
  
  getData(studentID,insideElse,loadingEl , index ,array,resolve){
    this.studentName(studentID).subscribe(resdata => {
      console.log(resdata);
      this.studentloadDone = true;
      if(resdata.length > 0){
        this.studentNameData.push({
          'student_id' : studentID,
          'name' : resdata[0]['name'],
          'class_id': resdata[0]['class_id']
          });
      } else if(!insideElse){
        // WE ARE CALLING THIS AGAIN BCUS IN OLD DATA WE HAVE STUDENT ID AS STRING AND WHEN WE RUN 
        // THE OPERATION IT FIND NONE SO IN THAT CASE WE HAVE TO USE STRING  
        insideElse = true;
        this.getData(studentID.toString(),insideElse,loadingEl , index ,array,resolve);
      }
      if (index === array.length - 1 ) { resolve(); }
     
    },
    errResdata => {
      this.isLoading = false;
      loadingEl.dismiss();
      const message = errResdata.error.error.message;
        this.showAlert(message);
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
}
