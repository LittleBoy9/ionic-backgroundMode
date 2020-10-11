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
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.page.html',
  styleUrls: ['./subject-detail.page.scss'],
})
export class SubjectDetailPage implements OnInit {
  classID: any;
  studentName: any;
  student_id: any;
  noDataFound = false;
  subjectlist = [];
  isLoading = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    // tslint:disable-next-line: no-shadowed-variable
    private ParentstudentService: ParentstudentService,
    private AdminService: AdminService,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.classID = paramMap.get('class_id');
      this.studentName = paramMap.get('studentName');
      this.student_id = paramMap.get('studentId');
      });

      this.isLoading = true;
      this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading...'})
      .then(loadingEl => {
        loadingEl.present();
      this.AdminService.getDataforValue('/subject','class_id',Number(this.classID)).subscribe(data => {
        loadingEl.dismiss();
        this.isLoading = false;

        if(data.length>0){
          this.subjectlist = data
        } else {
          this.noDataFound = true;
        }
      });
    });
  }

}
