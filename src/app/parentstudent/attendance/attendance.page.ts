import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../../auth/auth.service';
import { ParentstudentService } from '../parentstudent.service';
import { LoadingController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  StudentIDs: any;
  studentNameData: any = [];
  isLoading = false;
  constructor(private authService: AuthService,
    // tslint:disable-next-line: no-shadowed-variable
    public ParentstudentService: ParentstudentService,
     private loadingCtrl: LoadingController,
     private alertCtrl: AlertController, ) { }

  ngOnInit() {
  if(!this.ParentstudentService.studentloadDone){
    this.ParentstudentService.loadStudents();
  }
  }
  
 
}
