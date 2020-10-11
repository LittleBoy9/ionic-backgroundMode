import { Component, OnInit } from '@angular/core';
import { ParentstudentService } from '../parentstudent.service';


@Component({
  selector: 'app-exam',
  templateUrl: './exam.page.html',
  styleUrls: ['./exam.page.scss'],
})
export class ExamPage implements OnInit {
  StudentIDs: any;
  studentNameData: any = [];
  isLoading = false;
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public ParentstudentService: ParentstudentService,
   ) { }

  ngOnInit() {
    if(!this.ParentstudentService.studentloadDone){
      this.ParentstudentService.loadStudents();
    }
  }
  
}
