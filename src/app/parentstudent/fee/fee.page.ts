import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../../auth/auth.service';
import { ParentstudentService } from '../parentstudent.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.page.html',
  styleUrls: ['./fee.page.scss'],
})
export class FeePage implements OnInit {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private authService: AuthService, private ParentstudentService: ParentstudentService) { }
   StudentIDs: any;
   feesum: any[];
   invoices = [];
   insideElse = false;
   noDataFound = false;
   feedetails: any [];
  ngOnInit() {
    this.loadStudents();
  }
  loadStudents() {
    this.StudentIDs = this.authService.studentIDFromLocal;
    console.log(this.StudentIDs);
    let studentName: string;
    this.StudentIDs =  this.authService.StudentIDsUniversal;
    const arrayCheck = Array.isArray(this.StudentIDs);
    if (this.StudentIDs.length !== 0 && arrayCheck) {
      this.noDataFound = false;
      let count = 0
    this.StudentIDs.forEach(studentID => {
     // this.ParentstudentService.studentName(studentID).subscribe(resdata => {console.log(resdata); });
    this.insideElse = false;
     this.getData(Number(studentID),count);

    });
   } 
  }
getData(studentID,count){
  this.ParentstudentService.feeDetails(studentID).subscribe(res => {
    count = count + 1;
    if(count ==this.StudentIDs.length ){ this.noDataFound = true; }
    let sum: any = 0;
    let totalpaid = 0;
    const studentId = res[0]['student_id'];
  if (res.length !== 0) {
    this.noDataFound = false;
    this.ParentstudentService.studentName(res[0]['student_id']).
    subscribe(resdata => {
  res.forEach(values => {
    sum = sum + values['amount'];
    totalpaid = totalpaid + values['amount_paid'];
  });
     this.invoices.push({
  'amount': sum,
  'name' : resdata[0]['name'],
  'totalpaid': totalpaid,
  'student_id': studentId
});
this.feesum = sum;
});
} else if(!this.insideElse){
  this.insideElse = true;
  this.getData(studentID.toString(),count);
} 
});
}
}
