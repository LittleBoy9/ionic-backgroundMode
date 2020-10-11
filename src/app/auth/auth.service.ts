import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from '@angular/fire/database';
import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  displayName: string;
  expiresIn: string;
  registered?: boolean;
}


interface StudentData {
  aadhar_card: number;
add_no: string;
address: string;
admission_date: string;
authentication_key: string;
birthday: string;
blood_group: string;
category: string;
class_id: string;
dormitory_id: string;
dormitory_room_number: string;
email: string;
father_name: string;
femail: string;
fmobile_no: string;
fpassword: string;
mother_name: string;
name: string;
parent_id: string;
password: string;
phone: string;
previous_class: string;
previous_sch: string;
profession: string;
religion: string;
roll: number;
section_id: number;
sex: string;
sr_no: number;
status: string;
student_id: number;
transport_id: string;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  private loginAsValue: string;
  private studentId: string;
  student: any[] ;
  StudentIDsUniversal: any;
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }
  get displayNameFromLocal() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.displayName;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
          displayName: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          parsedData.displayName,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signup(email: string, password: string, studentid: string) {
    this.studentId = studentid;
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
          environment.firebaseAPIKey
        }`,
        { email: email, password: password, displayName: studentid,  returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
          environment.firebaseAPIKey
        }`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
    localStorage.clear();
   
   
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
  checkforCredentail(path ,table ,childvalue,emaildata) {
    const fullpath = path + table;
  return this.db.list
  (fullpath, ref => ref.orderByChild(childvalue).equalTo(emaildata)).snapshotChanges();
  }

  updateData(path,table, data) {
    return this.db.object
    (path + table).update(data);
}

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      userData.displayName,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      userData.displayName,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    displayName: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      displayName: displayName,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

 storeuserIdInStudent(userData: AuthResponseData) {
 const childnamevalue = this.loginAsValue + 'FireID';
 const nodedetail = '/student/' + this.studentId;
 console.log('child name -' + childnamevalue);
 console.log('node name -' + nodedetail);
console.log('userid' + userData.localId);
this.db.object
  ('/student/${this.studentId}')
  .update({
    [childnamevalue] : userData.localId
  });
 }

 getSetting(typename) {
  return this.db.list
  ('/settings', ref => ref.orderByChild('type').equalTo(typename)).valueChanges();
}
getSettingfromBranch(typename ,path) {
  console.log(path + '/settings');
  return this.db.list
  (path + '/settings', ref => ref.orderByChild('type').equalTo(typename)).valueChanges();
}

 get studentIDFromLocal() {
   const displayname = JSON.parse(localStorage.getItem('_cap_authData')).displayName;
  const patt = new RegExp('|');
  if (patt.test(displayname)) {
    this.StudentIDsUniversal = String(displayname).split('|');
    this.StudentIDsUniversal =  this.StudentIDsUniversal.slice(1 ,  (this.StudentIDsUniversal.length - 2));
  
  } else {
    this.StudentIDsUniversal = String(displayname);
  }
  return this.StudentIDsUniversal;
 }

 getDataOnlyValue(table, id) {
  return this.db.list
  ( table , ref => ref.orderByChild(id)).valueChanges();
}
getDataOnlyfromBranch(table, path, id) {
  return this.db.list
  (path + table , ref => ref.orderByChild(id)).valueChanges();
}


getDataforValue(table, id , idValue) {
  return  this.db.list
    ( table, ref => ref.orderByChild(id).equalTo(idValue)).valueChanges();
}
getDataforValuefrombranch(table,path, id , idValue) {
  return  this.db.list
    (path + table, ref => ref.orderByChild(id).equalTo(idValue)).valueChanges();
}
pushDatawithoutID(data, table,path) {
  return this.db.list(path +table)
  .push(data);
}


getMax(arr, prop) {
  let max = 0;
  for (let i=0 ; i<arr.length ; i++) {
      // tslint:disable-next-line: radix
      if (max == null || parseInt(arr[i][prop]) > max) {
          max = parseInt(arr[i][prop]);
      }
  }
  // tslint:disable-next-line: radix
  return max + 1 ;
}

dateFormatChangeinDesFormat(date,Format) {
  let updatedDate;
  console.log(date);
  if ((date !== undefined && date !== null)) {
    if (date.includes('T')) {
    const onlyDate = date.split('T')[0];
 updatedDate = onlyDate.split('-')[2] + Format + onlyDate.split('-')[1] + Format + onlyDate.split('-')[0] ;
    } else if (!date.includes('T')) {
      updatedDate = date.split('/')[1] + Format + date.split('/')[0] + Format + date.split('/')[2] ;
    }
  } else {
    updatedDate = '';
  }
 return updatedDate;
}

 

  }

