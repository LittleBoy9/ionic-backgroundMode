import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParentstudentService } from 'src/app/parentstudent/parentstudent.service';
import { AdminService } from '../../../admin.service';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.page.html',
  styleUrls: ['./exam-detail.page.scss'],
})
export class ExamDetailPage implements OnInit {
  classID: any;
  studentName: any;
  student_id: any;
  examresultArray;
  isLoading = false;
  exam: any;
  resultData: any;
  totalMark: number = 0;
  markObtain: number = 0;
  percentMark: any;
  showResult = false;
  subjectlist = [];
  ResultFullList = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    // tslint:disable-next-line: no-shadowed-variable
    private ParentstudentService: ParentstudentService,
    private AdminService: AdminService,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.classID = paramMap.get('class_id');
      this.studentName = paramMap.get('studentName');
      this.student_id = paramMap.get('studentId');
      });
      this.loadData( );
this.AdminService.getDataforValue('/subject','class_id',Number(this.classID)).subscribe(data => this.subjectlist = data);
this.AdminService.getDataforValue('/mark','student_id',    Number(this.student_id)).subscribe(data => this.ResultFullList = data);
  }
  loadData() {
    this.isLoading = true;
    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Loading...'})
    .then(loadingEl => {
      loadingEl.present();
    this.ParentstudentService.exam().subscribe(res => {
      this.exam = res;
      loadingEl.dismiss();
      this.isLoading = false;
    }, errResdata => {
      this.isLoading = false;
      loadingEl.dismiss();
      const message = errResdata.error.error.message;
        this.showAlert(message);
    });
  });
  }
  selectedExam(e) {
    this.showResult = true;
    this.totalMark = 0 ;
      this.markObtain = 0;
    this.resultData = [];


const ParticularExamResult =  this.ResultFullList.find(el=>el.exam_id ==e.detail.value);
if(ParticularExamResult != undefined){
  this.markObtain  = 0;
  this.totalMark = 0;
  this.percentMark = 0;
  let count = 0;
  this.subjectlist.forEach(subject=>{
    const subjectMark =ParticularExamResult[subject['subject_id']];
    if(subjectMark != undefined){
      this.markObtain = Number(this.markObtain) + Number(subjectMark['obtain']);
      this.totalMark = Number(this.totalMark) + Number(subjectMark['max']);
      this.resultData.push({
        'subject': subject['name'],
        'mark_total' : subjectMark['max'],
        'mark_obtained' : subjectMark['obtain'],
        'mark_min' : subjectMark['min']
      }); 
      count = count + 1;
      if(count == this.subjectlist.length){
        this.percentMark = Number(( this.markObtain / this.totalMark) * 100)
      }
    }
  })

}






  //       console.log(e.detail.value);
  //   // e.detail.value show examID
  //   this.ParentstudentService.examMark(Number(e.detail.value)).subscribe(res => {
  //     console.log(res);
  //     res.forEach(data => {
      
  //       console.log(data['mark_obtained'])
  //       this.ParentstudentService.subjectName(data['subject_id']).
  //       subscribe(resdata => {
  //         localMarkTotal =  + data['mark_total'];
  //         this.totalMark  = this.totalMark  + localMarkTotal;
  //         if(data['mark_obtained'] !=='A'){
  //         localMarkObtain  =  + data['mark_obtained'];
  //         this.markObtain  =  this.markObtain +localMarkObtain ;
  //         }
  //         console.log(this.markObtain);
  // this.resultData.push({
  //   'subject': resdata[0]['name'],
  //   'mark_total' : data['mark_total'],
  //   'mark_obtained' : data['mark_obtained'],
  //   'mark_min' : data['mark_min']
  // });
  // this.percentMark = (( this.markObtain / this.totalMark) * 100).toFixed(2);
  // });
  //     });
  //   });
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
