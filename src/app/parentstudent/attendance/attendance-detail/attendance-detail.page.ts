import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParentstudentService } from 'src/app/parentstudent/parentstudent.service';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.page.html',
  styleUrls: ['./attendance-detail.page.scss'],
})
export class AttendanceDetailPage implements OnInit {
  studentId: any;
  studentName: any;
  allData = [];
  studentPresent = [];
  studentAbsent = [];
  attendancePercntage: any ;
  isLoading = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    // tslint:disable-next-line: no-shadowed-variable
    private ParentstudentService: ParentstudentService,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.studentId = paramMap.get('studentId');
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
    this.ParentstudentService.AttendanceDetail(this.studentId).subscribe(res => {
      this.allData = res;
      for (let i = 0; i < res.length; i++) {
        // tslint:disable-next-line: triple-equals
        if (res[i]['status'] == 1) {
          this.studentPresent.push (res[i]);
        // tslint:disable-next-line: triple-equals
        } else if (res[i]['status'] == 0) {
          this.studentAbsent.push (res[i]);
        }
      }
      console.log(  this.studentAbsent);
      this.attendancePercntage = (this.studentPresent.length / this.allData.length) * 100;
      this.isLoading = false;
      loadingEl.dismiss();
      console.log(res);
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
}
