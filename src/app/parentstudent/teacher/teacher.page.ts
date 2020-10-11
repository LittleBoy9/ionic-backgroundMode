import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AdminService } from '../../admin.service';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnInit {
  teacherList = [];
  subjectList = [];
  noDataFound = false;
  isLoading = false;
  // tslint:disable-next-line: no-shadowed-variable
  constructor( private AdminService: AdminService, private loadingCtrl: LoadingController,) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Loading...'})
    .then(loadingEl => {
      loadingEl.present();
      this.AdminService.getDataOnlyValue('/subject','subject_id').subscribe(subject =>{

         this.subjectList = subject;
    this.AdminService.getDataforValue('/teacher','post','T').subscribe(data => {
      console.log(data);
      loadingEl.dismiss();
      this.isLoading = false;
      if(data.length > 0) {
        this.teacherList = data;
        this.teacherList = [];
        data.forEach(teacher => {
  
          const subject = this.subjectList.find(el=>el.teacher_id == teacher['teacher_id']);
          this.teacherList.push({
            'name': teacher['name'],
            'subject': subject != undefined ? subject['name'] :'',
            'Imageurl': teacher['Imageurl'] != undefined && teacher['Imageurl'] != '' ? 'https://drive.google.com/uc?id=' + teacher['Imageurl'] : 'assets/GeneralIcons/teacher.png'
          });
        });
        console.log(this.teacherList);
      } else {
this.noDataFound = true;
      }
     });
    });
  });
  }

}
