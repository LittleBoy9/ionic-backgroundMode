import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService, AuthResponseData } from './auth.service';
import { environment } from 'src/environments/environment';
import { listenToElementOutputs } from '@angular/core/src/view/element';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  email;
  password;
  selectedImage;
  path;
  multiBranch: any = environment.MultiBranch;
  branchList = [];
  Branch: any;
  allowVisitorLogin: boolean ;
  oneLogin: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private db: AngularFireDatabase,
  ) {}

  ngOnInit() {
    this.authService.getSetting('Logo').subscribe(data => { 
      if (data[0]['description'] != undefined && data[0]['description'] != '') {
      this.selectedImage =  'https://drive.google.com/uc?id=' + data[0]['description'];
      } else {
        console.log('INSIDE ELSE '); 
        this.selectedImage = 'assets/icon/OnlyLogo.png'}
    });
    this.authService.getDataOnlyValue('/branch', 'label').subscribe(data => this.branchList = data);
  }

  authenticate(email: string, password: string , f) {
let LoginAs;
 // TO SELECT WHICH BRANCH WE HAVE TO LOGIN 
 this.path = ''
   if (f.value.Branch != undefined && this.multiBranch) { 
   this.Branch =  f.value.Branch;
   this.authService.getDataforValue('/branch', 'value', this.Branch  )
   .subscribe(data => {const currentSession = data[0]['currentSession']['value'];
    this.path = this.Branch + '/' + currentSession
    this.authService.getSettingfromBranch('Allow_visitor' , this.path).subscribe(data => {
      this.allowVisitorLogin = data[0]['description'];
    });
  });
   } else {
    this.authService.getDataOnlyValue('/branch', 'value').subscribe(data => {  
        const currentSession = data[0]['currentSession']['value'];
      this.path = data[0]['value'] + '/' + currentSession;
      
      this.authService.getSettingfromBranch('Allow_visitor' , this.path).subscribe(data => {
        this.allowVisitorLogin = data[0]['description'];
      });
    });
   }
  

    console.log(email + '' + password );
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
          authObs = this.authService.login(email, password);
        authObs.subscribe(
          resData => {
            this.authService.StudentIDsUniversal = String(resData.displayName).split('|');
            this.authService.StudentIDsUniversal  = this.authService.StudentIDsUniversal 
            .slice(1 ,  (this.authService.StudentIDsUniversal.length - 2));
            this.isLoading = false;
            loadingEl.dismiss();
            if (resData.displayName.indexOf('V') != -1) {
              this.router.navigateByUrl('/stvideo');
            } else {
              this.router.navigateByUrl('/dashboard');
            }
          },
          errRes => {
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            let showmessage = false;
            let wrongPassword = false;
            if (code === 'EMAIL_EXISTS') {
              loadingEl.dismiss();
              showmessage = true;
              message = 'This email address exists already!';
            } else if (code === 'INVALID_PASSWORD') {
              loadingEl.dismiss();
              showmessage = true;
              message = 'This password is not correct.';
            } else if (code === 'EMAIL_NOT_FOUND') {
              // DOING THE SIGNUP HERE AS THE NO DATA FOUND IN AUTHENTICATION SO KNOW FECTHING
              // THE DETAILS FROM THE REALTIMEDATABASE
             console.log('email not found ,so doing the signup' );
             this.parentSignUp(email, password, loadingEl , wrongPassword , showmessage , message , 'email' , '/student', 'password');
            }if (showmessage) {
            this.showAlert(message);
            }
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  // onSubmit(form: NgForm) {
  //   if (!form.valid) {
  //     return;
  //   }
  //   const email = form.value.email;
  //   const password = form.value.password;
  //   const LoginAs = form.value.LoginAs;
  //   const schoolCode = form.value.schoolCode;

  //   this.authenticate(email, password, 'student', schoolCode);
  //   form.reset();
  // }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  parentSignUp(email, password, loadingEl , wrongPassword , showmessage , message , mailtype , table , passwordFieldName) {
    let id;
    let authObs: Observable<AuthResponseData>;
    this.authService.checkforCredentail( this.path, table, mailtype, email).subscribe(Data => {
      if (Data.length !== 0) {
       let studentid = '';
       console.log(table);
       if (table == '/student'){
         studentid = mailtype == 'email' ? 'S' : 'P';
       } else {
         console.log('inside else table is not student')
        studentid = 'V';
       }
       let count =0;
       Data.forEach(res => {

        const values = res.payload.val();
        id = res.payload.key;

      console.log(values[passwordFieldName] + "="  + password);
         if (values[passwordFieldName] == password) {
           console.log(values['student_id']);
           console.log('student_id -' + values['student_id']);
           studentid  =  studentid + '|' + values['student_id'] ;
           count = count + 1;
           // tslint:disable-next-line: triple-equals
           if (Data.length == count) {
            studentid = studentid + '||' + this.path;
           }
         } else {
           wrongPassword = true;
         }
       });

       if (!wrongPassword) {
       authObs = this.authService.signup(email, password, studentid);
         authObs.subscribe(
           resData => {

               this.authService.StudentIDsUniversal = String(resData.displayName).split('|');
               this.authService.StudentIDsUniversal  = this.authService.StudentIDsUniversal .slice(1 ,  (this.authService.StudentIDsUniversal.length - 2));

              // SET STUDENT LOGIN TO TRUE NEXT TIME WE WILL CHECK IF ITS TRUE THEN WE WILL  STOP THE USER TO LOGIN 
              const Data = {
                'alreadyLogin': true
                };  
          this.updateStudent(id ,Data);



             this.isLoading = false;
             loadingEl.dismiss();
             if (table == '/student') {
              this.router.navigateByUrl('/dashboard');
            } else {
              this.router.navigateByUrl('/stvideo');
            }
            
           }, errResdata => {
             const errorcode = errResdata.error.error.message;
             console.log('error code- ' + errorcode);
           }
      );
          }
    } else {
      // tslint:disable-next-line: triple-equals
      console.log(  this.allowVisitorLogin);
      if (mailtype == 'email') {
        console.log('inside parent signup');
        this.parentSignUp(email, password, loadingEl , wrongPassword , showmessage , message , 'femail' , '/student', 'fmobile_no');
      // tslint:disable-next-line: triple-equals
      
      } else if (mailtype == 'femail' && this.allowVisitorLogin) {
        console.log('inside visitor signup');
        this.parentSignUp(email, password, loadingEl , wrongPassword , showmessage , message , 'email' , '/registered' , 'password');
      } else {
        console.log('Password is wrong');
        loadingEl.dismiss();
        showmessage = true;
        message = 'Incorrect Password & Email !';
        this.showAlert(message); 
      }
     
    }
    if (wrongPassword  ) {
      console.log('Password is wrong');
      loadingEl.dismiss();
      showmessage = true;
      message = 'Incorrect Password!';
      this.showAlert(message);
      }
     });
  }

  updateStudent(id ,Data){
  
      const tablepath = '/student' + '/' + id;
      this.authService.updateData(this.path, tablepath , Data )
      .then(() => {
      console.log('Student Already login set true');
      }
      ).catch(
      (err) => {
      console.log(err);
      });
  }
}
