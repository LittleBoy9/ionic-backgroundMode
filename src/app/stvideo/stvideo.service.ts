import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StvideoService {
  authData = JSON.parse(localStorage.getItem('_cap_authData'));
  baseDBpath;
  url = 'https://schooldemo-4df2c.firebaseio.com/class_routine.json';
  video_db_url = 'https://schooldemo-4df2c.firebaseio.com/tut_video.json';

  constructor(private http:HttpClient, private db: AngularFireDatabase ,    private router: Router,
    private authService: AuthService) {
    this.setDBpath();

   }
   setDBpath() {
    if(this.authData != undefined && this.authData != null && this.authData != ''){
      this.baseDBpath = this.authData.displayName.split('||')[1];
    }   // else is temporary code to show logo from branch 1 until we didn't have super admin , remove it once You have Super admin
  }

  fetchData(){
  		return this.http.get(this.url);
  }

  fetchdata(class_id,table){
    return this.db.list
    (this.baseDBpath + table, ref => ref.orderByChild('class_id').equalTo(class_id)).valueChanges();
    //return this.http.get(this.video_db_url);
  }

  getDataforValue(table, id , idValue) {
    return  this.db.list
      (this.baseDBpath + table, ref => ref.orderByChild(id).equalTo(idValue)).valueChanges();
  }

  getDataforValuewithID(table, id , idValue) {
    return  this.db.list
      (this.baseDBpath + table, ref => ref.orderByChild(id).equalTo(idValue)).snapshotChanges();
  }
  
  updateData(path, data) {
      return this.db.object
      (this.baseDBpath + path).update(data);
  }

  fetchLiveVideo(){
    return this.db.list
    (this.baseDBpath + '/tut_channel', ref => ref.orderByChild('class_id')).valueChanges();
    //return this.http.get(this.video_db_url);
  }

  ClassRoutine(class_id) {
    return this.db.list
    (this.baseDBpath + '/class_routine', ref => ref.orderByChild('class_id').equalTo(class_id)).valueChanges();

  }
  subjectName(subjectid: string) {
      return this.db.list
    (this.baseDBpath +'/subject', ref => ref.orderByChild('subject_id').equalTo(subjectid)).valueChanges();
  }
  optionalSubjectName(subjectid: string) {
      return this.db.list
    (this.baseDBpath +'/optional_subject', ref => ref.orderByChild('subject_id').equalTo(subjectid)).valueChanges();
  }

   // ******************* LOAD STUDENT DETAILS *************************//
   studentName(email,table) {
    return this.db.list
    (this.baseDBpath +table, ref => ref.orderByChild('email').equalTo(email)).valueChanges();
    }

    onLogout() {
      this.authService.logout();
      this.router.navigateByUrl('/auth');
      
    }
}
