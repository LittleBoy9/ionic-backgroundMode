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
  selector: 'app-fee-detail',
  templateUrl: './fee-detail.page.html',
  styleUrls: ['./fee-detail.page.scss'],
})
export class FeeDetailPage implements OnInit {
  studentId: any;
  studentName: any;
  fee: any;
  payment = [];
  feePaid: any;
  isLoading = false;
  FMRatio;
  constructor( private router: Router,
    private route: ActivatedRoute,private AdminService: AdminService,
    private ParentstudentService: ParentstudentService,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
    this.studentId = paramMap.get('studentId');
    this.studentName = paramMap.get('studentName');
    this.fee = paramMap.get('total');
    this.feePaid = paramMap.get('totalpaid');
    });
    this.FMRatio = {
      labels: ['Due', 'Paid'],
      datasets: [
          {
              data: [(this.fee -this.feePaid),  this.feePaid],
              backgroundColor: [
                  '#ffa600',
                  '#000000'
              ],
              hoverBackgroundColor: [
                '#ffa600',
                '#000000'
              ]
          }]
      };
     this.isLoading = true;
     
     this.AdminService.getDataforValue('/payment', 'student_id/0',Number(this.studentId) ).subscribe(data => {
       console.log(data);
      data.forEach(res => {
        console.log(res);
        if(res['status']  != '2' && res['status']  != '1'){
          this.payment.push(res);
        }
        });
  
     });
   
    this.isLoading =false;
  }
}
