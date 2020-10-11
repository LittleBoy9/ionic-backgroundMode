import { Component, OnInit } from '@angular/core';
import { ParentstudentService } from '../parentstudent.service';
@Component({
  selector: 'app-subject',
  templateUrl: './subject.page.html',
  styleUrls: ['./subject.page.scss'],
})
export class SubjectPage implements OnInit {

  constructor(    public ParentstudentService: ParentstudentService,) { }

  ngOnInit() {
    if(!this.ParentstudentService.studentloadDone){
      this.ParentstudentService.loadStudents();
    }
  }

}
