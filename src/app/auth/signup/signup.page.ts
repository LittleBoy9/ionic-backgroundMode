import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Platform, LoadingController , ToastController } from '@ionic/angular';
import { AdminService } from '../../admin.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  class = [];
  isLoading: boolean = false;
  name;
  father_name;
  email;
  password;
  phone;
  class_id;
  sex;
  birthday;
  hearUS;

  todaysDate;
  Branch;
  branchList = [];
  multiBranch: any = environment.MultiBranch;
  path: string;
  maxID: number;
  registerdStudentList = [];
  constructor( private AdminService: AdminService,  
    private authService: AuthService, 
    private Platform: Platform, 
     private loadingCtrl: LoadingController,
     public toastController: ToastController ,
     private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    if (this.multiBranch) {
      this.loadingCtrl
      .create({ keyboardClose: true, message: '' })
      .then(loadingEl => {
      this.authService.getDataOnlyValue('/branch', 'label').subscribe(data => {
        loadingEl.dismiss();
        this.branchList = data;
      });
    });
    } else {
      this.loadingCtrl
      .create({ keyboardClose: true, message: '' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.getDataOnlyValue('/branch', 'value').subscribe(data => {
          const currentSession = data[0]['currentSession']['value'];
        this.path = data[0]['value'] + '/' + currentSession;
        this.getclass(loadingEl);
        this.getregisterdStudentList()
      });

      });
    }
  }
  getregisterdStudentList(){
    this.registerdStudentList = [];
    this.authService.getDataOnlyfromBranch('/registered', this.path , 'student_id').subscribe(Student => 
      this.registerdStudentList = Student );
  }
  getclass(loadingEl) {
    this.class = [];
    this.authService.getDataOnlyfromBranch('/class', this.path , 'class_id').
    subscribe(classdata => {
      loadingEl.dismiss();
       this.class = classdata; });
  }
  getclasssimple() {
    this.class = [];
    this.authService.getDataOnlyfromBranch('/class', this.path , 'class_id').
    subscribe(classdata => {

       this.class = classdata; });
  }

  onbranchChange(e) {
    
    console.log(e.detail.value);
    const branch = e.detail.value;
    this.authService.getDataforValue('/branch', 'value', branch  ).
    subscribe(data => {const currentSession = data[0]['currentSession']['value'];
    this.path = branch + '/' + currentSession;
    this.getclasssimple();
    this. getregisterdStudentList();
  });
  }


  submit(f){
    console.log(f.value);
    const  values = f.form.value;
    const DateofBirth = this.authService.dateFormatChangeinDesFormat(values.birthday, '/');
    if (  this.registerdStudentList.length > 0 ) {
      this.maxID = this.authService.getMax(this.registerdStudentList , 'student_id' );
    } else {
      this.maxID = Math.floor(Math.random() * 6000000) + 10000 ;
    }
    const Data = {
      'class_id' : values.class_id != undefined ? values.class_id : '',
      'email' : (values.email != undefined) && (values.email != '') ? values.email : '',
      'birthday' : DateofBirth ,
      'father_name' : values.father_name != undefined ? values.father_name   : '',
      'password' :  values.password,
      'phone' : values.phone != undefined ? values.phone : '',
      'name' : values.name,
      'roll' : values.roll  != undefined ? values.roll : '',
      'sex' : values.sex != undefined ? values.sex : '' ,
      'timestamp':  new Date().toISOString().split('T')[0],
      'hearUS' : values.hearUS != undefined ? values.hearUS : '',
      'student_id' : this.maxID
};

this.authService.pushDatawithoutID(Data, '/registered', this.path )
.then(async state => {
console.log('Success');
const toast = await this.toastController.create({
  message: 'Registered Successfully.',
  duration: 2000
});
toast.present();
this.router.navigate(['/auth'], { relativeTo: this.route });
f.resetForm();
}
).catch(
 (err) => {
   
   console.log(err);
 });

  }

}
