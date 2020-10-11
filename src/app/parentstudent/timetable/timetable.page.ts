import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../../auth/auth.service';
import { ParentstudentService } from '../parentstudent.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
})
export class TimetablePage implements OnInit {

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
