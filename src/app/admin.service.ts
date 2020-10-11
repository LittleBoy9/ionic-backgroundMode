import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from '@angular/fire/database';

import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  authData = JSON.parse(localStorage.getItem('_cap_authData'));
  baseDBpath;
  baseURl = 'https://instantalerts.co/api/web/send/?apikey=' + environment.MessageAPI;
  constructor(private authService: AuthService, private storage: AngularFireStorage,
     private http: HttpClient, private db: AngularFireDatabase) {
       this.setDBpath();
      }


      setDBpath() {
        if(this.authData != undefined && this.authData != null && this.authData != ''){
          this.baseDBpath = this.authData.displayName.split('||')[1];
        }   // else is temporary code to show logo from branch 1 until we didn't have super admin , remove it once You have Super admin
      }
  // feeDetails(studentid: string) { 
  // return this.db.list
  // (this.baseDBpath +'/invoice', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
  // }

  // paymentDetail(studentid: string) {
  //   return this.db.list
  //   (this.baseDBpath +'/payment', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
  // }

  // ClassRoutine(class_id: string) {
  //     return this.db.list
  //     (this.baseDBpath +'/class_routine', ref => ref.orderByChild('class_id').equalTo(class_id)).valueChanges();
  // }

  // AttendanceDetail(studentid: string) {
  //     return this.db.list
  //     (this.baseDBpath +'/attendance', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
  // }
  // studentName(studentid: string) {
  //   return this.db.list
  //   (this.baseDBpath +'/student', ref => ref.orderByChild('student_id').equalTo(studentid)).valueChanges();
  // }

  // subjectName(subjectid: string) {
  //     return this.db.list
  //     (this.baseDBpath +'/subject', ref => ref.orderByChild('subject_id').equalTo(subjectid)).valueChanges();
  // }
  // exam() {
  //       return this.db.list
  //       (this.baseDBpath +'/exam', ref => ref.orderByChild('declare_result').equalTo('1')).valueChanges();
  // }

  //   // HERE WE ARE FETCHING COMPLETE EXAM AND WILL APPLY OPERATIONS LATER ON THIS
  // examMark(examid: string)  {
  //     return this.db.list
  //     (this.baseDBpath +'/mark', ref => ref.orderByChild('exam_id').equalTo(examid)).valueChanges();
  // }

    // **************PUSH AND GET DATA *******************/
  pushData(data, table, id) {
      return this.db.list(this.baseDBpath + table)
      .set(id, data);
  }
  pushDatawithoutID(data, table,) {
    return this.db.list(this.baseDBpath +table)
    .push(data);
}
pushDataWithOut_id(data, table){
  return this.db.list(table)
      .push(data);
}



  getData(table, id) {
    return this.db.list
    (this.baseDBpath + table , ref => ref.orderByChild(id)).snapshotChanges();
  }

  getData_1(table, id) {
    return this.db.list
    (table , ref => ref.orderByChild(id)).snapshotChanges();
  }

  getDataOnlyValue(table, id) {
    console.log(this.baseDBpath + table);
      return this.db.list
      (this.baseDBpath + table , ref => ref.orderByChild(id)).valueChanges();
  }

  getDataOnlyValue_1(table, id) {
      return this.db.list
      (table , ref => ref.orderByChild(id)).valueChanges();
  }

  Message(sender, mobileNo, message) {
      const fullURL = this.baseURl + '&sender=' + sender + '&to=' + mobileNo + '&message='
      + message + '&format=json';
      return this.http.get( fullURL);
  }
  getSetting(typename) {
  
      return this.db.list
      (this.baseDBpath + '/settings', ref => ref.orderByChild('type').equalTo(typename)).valueChanges();
  }

 
  
  getSMSSetting(typename) {
    console.log(this.baseDBpath);
    return this.db.list
    (this.baseDBpath + '/sms_settings', ref => ref.orderByChild('message').equalTo(typename)).valueChanges();
}

  getKey(table, id , idValue) {
    return  this.db.list
      (this.baseDBpath + table, ref => ref.orderByChild(id).equalTo(idValue)).snapshotChanges();
  }
  
  getDataforValue(table, id , idValue) {
    console.log(this.baseDBpath + table);
    return  this.db.list
      (this.baseDBpath + table, ref => ref.orderByChild(id).equalTo(idValue)).valueChanges();
  }

  getDataforValue_1(table, id , idValue) {
    return  this.db.list
      (table, ref => ref.orderByChild(id).equalTo(idValue)).valueChanges();
  }
  
  getDataforValuewithID(table, id , idValue) {
    return  this.db.list
      (this.baseDBpath + table, ref => ref.orderByChild(id).equalTo(idValue)).snapshotChanges();
  }

  updateData(path, data) {
      return this.db.object
      (this.baseDBpath + path).update(data);
  }

  updateData_1(path, data) {
    console.log(path)
    console.log(data)
     return this.db.object
      (path).update(data);
  }

  
  updateLogo(path, data) {
    return this.db.object
    ( path).update(data);
}

  delete(path) {
     return this.db.object(this.baseDBpath + path).remove();
  }

  delete_1(path) {
     return this.db.object(path).remove();
  }

  deleteList(table) {
     return this.db.list (this.baseDBpath + table).remove();

  }

  uploadImage(image: File, path) {
      return  this.storage.upload(path, image);
  }

  DownloadImage(path) {
       return this.storage.ref(path).getDownloadURL();
  }

  DeleteImage(path) {
      return this.storage.ref(path).delete();
  }



  // // GOOGLE DRIVE FUNCTIONS 
  // senddata(url, data) {
  //   const fullUrl = environment.ServerUrl + url;
  //   return this.http.post(fullUrl, data);
  // }
  // getdata(url, data) {
  //   const fullUrl = environment.ServerUrl + url;
  //   return this.http.get(fullUrl, data);
  // }
  // uploadFiles(url, file : File,ID) {
  //   const fullUrl = environment.ServerUrl + url;
  //   const formData: FormData = new FormData();
  //  formData.append('file', file, file.name + '最' + ID);
  //   return this.http.post(fullUrl, formData);
  // }

}
