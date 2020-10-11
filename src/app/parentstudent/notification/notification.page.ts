import { Component, OnInit } from '@angular/core';

import {  Platform } from '@ionic/angular';
import { AdminService } from '../../admin.service';
import { Message } from 'primeng//api';
import { MessageService } from 'primeng/api';

import {
  		 NavController,
         LoadingController,
    	 AlertController
		} from '@ionic/angular';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
	isLoading = false;

	mobile = false;
	display = false;
	displaySection = false;
	edit = false;
	editFlag;

	rowId;

	cols = [];

	deletingNotification= false;

	selectedData;
	deleteNotificationId;

	max_notification_id;
	notificationIdtoEdit: any;

	notification_data_raw = [];
	NotificationData = [];

  constructor(private AdminService: AdminService,
  			  private loadingCtrl: LoadingController ,
   			  private alertCtrl: AlertController,
   			  private messageService: MessageService,
              private Platform: Platform,
              ) { }

  ngOnInit() {
  	console.log(this.Platform.is('mobile'))
    if (this.Platform.is('mobile')) {
      this.mobile = true;
      this.cols = [
          { field: 'title', header: 'Title' },
          { field: 'text', header: 'Text'}        
      ];
    }
    else{
      this.cols = [
          { field: 'title', header: 'Title' },
          { field: 'text', header: 'Text'},
          { field: 'data', header: 'Data'}         
      ];
    }

  /*  this.AdminService.getData_1('/notification', 'notification_id').subscribe(Data_res => {
        
        this.notification_data_raw = Data_res; 
        console.log(this.notification_data_raw);
          
        if(this.notification_data_raw.length > 0){ 
          console.log("data present in notification table in DATABASE")   
          this.getNotificationData();
        }             
    })*/
  }

  /*getNotificationData(){
  	this.NotificationData = [];

  	this.notification_data_raw.forEach(res => {
          const data = res.payload.val();
          const id = res.payload.key;
        

          this.NotificationData.push({
                'notification_id': data['notification_id'],
                'title': data['title'],
                'text': data['text'],
                'data': data['data'], 
                'status': data['status'],                                                    
                'id': id,
          }); 
      })
      console.log(this.NotificationData)
  }

  send_notification(rowData){
  	console.log(rowData)
  	const row_Id = rowData.id

            console.log('notification ID ON FLAG' + row_Id);
            const path = '/notification' + '/' + row_Id
            console.log('path' + path);

            const Data_1 = {
            	'notification_id': rowData['notification_id'],         
                'title': rowData['title'],
                'text': rowData['text'],
                'data': rowData['data'], 
                'status': 1 
            }
            this.AdminService.updateData_1(path , Data_1 ).then(() => {
                               
                this.messageService.add({severity: 'success', 
                						 summary: 'Success Message', 
                						 detail: 'Notification submitted'
                						});                  
               
            }).catch((err) => {                         
                console.log(err);
            });
                 
            

  }

  onClose(f){
  	 this.display = false;
     this.displaySection = false;
     f.resetForm();
   }

  addNotification(f){
  	console.log(f)
    f.resetForm();
    this.edit = false;
    console.log('Add new notification');
    this.display = true;
  }

  // MAX VALUES FROM ARRAY
  getMax(arr, prop) {
    let max = 0;
    	for (let i=0 ; i<arr.length ; i++) {
        	// tslint:disable-next-line: radix
        	if (max == null || parseInt(arr[i][prop]) > max) {
            	max = parseInt(arr[i][prop]);
        	}
    	}
    return max + 1 ;
  }

  onNotificationSubmit(f, flag){
  	  console.log('after notification submit');
      let notification_id = 0;

        if (f.valid) {   
          console.log(this.edit);
          const  values = f.form.value;         
          console.log(this.NotificationData)
          if ( !this.edit && this.NotificationData.length > 0 ) {
            console.log("getting max notification_id")
            this.max_notification_id = this.getMax(this.NotificationData,'notification_id' );          
          } 
          else {
            this.max_notification_id = 0;
          }
          this.NotificationData = [];
            console.log(this.max_notification_id)
            const Data = {  
                'notification_id': flag === 'N' ? this.max_notification_id++ : this.notificationIdtoEdit,         
                'title': values.title,
                'text': values.text,
                'data': values.data != undefined ? values.data : '', 
                'status': 0               
            }; 

            console.log(Data) 

        if (flag === 'N') {             
            console.log(Data)
            this.AdminService.pushDataWithOut_id(Data,'/notification').then( state => {
                 console.log(state) ;
                 this.successMsg();
                // this.displaySection = false;
                 f.resetForm();
              }).catch(
                (err) => {
                  this.errorMsg();
                  console.log(err);
            });
        }*/
        /*else if(flag === 'U'){
        	console.log(Data);
            console.log('itemstore ID ON FLAG' + this.rowId);
            const path = '/itemstore' + '/' + this.rowId
            console.log('path' + path);

            this.AdminService.updateData(path , Data ).then(() => {
                if (this.edit) {
                    this.itemStoreIdtoEdit = '';
                    this.messageService.add({severity: 'success', summary: 'Success Message', detail: 'Data submitted'});
                    this.display = false;
                    this.edit = false;
                    this.editFlag ='';
                    f.resetForm();
                }
            }).catch((err) => {                         
                console.log(err);
            });
                 
            }*/
  /*      }
        this.display = false;
  }

  editItemStoreRow(rowData, f, flag){
      this.editFlag = flag;
      this.edit = true;
      this.rowId = rowData.id;
      this.notificationIdtoEdit = rowData.notification_id;
      console.log(this.notificationIdtoEdit)
      console.log('on edit');
      console.log(rowData);
      f.setValue({          
          title: rowData.title,  
          data: rowData.data,        
          description: rowData.description !== undefined ? rowData.description : ''
      });
     this.display = true;
  }


  showConfirmForSelected(row , flag){
  	  this.selectedData = [row.id];
      this.messageService.clear();
      this.deleteNotificationId = row.notification_id;
      console.log(this.deleteNotificationId)

      if (flag === 'G') {
        this.deletingNotification = true;
        this.AdminService.getDataforValue_1('/notification', 'notification_id', row.notification_id).subscribe(Data => {
          console.log(Data)
          console.log(Data.length);
         
           this.messageService.add({key:'d',sticky:true,severity:'warn',summary: 'Are you sure?',    
            detail: 'This will delete all selected Data & this process cannot be undone'
           });                   
        });
      }     
  }

  delete(table){
      this.deletingNotification = false;
      this.messageService.clear('d');

      let path = '';
      path = table + this.selectedData;
      console.log(path)
      this.AdminService.delete_1(path )
      .then(() => {      
       this.messageService.add({severity: 'success', summary: 'Success Message', detail: 'Data removed Successfully'});
        this.deleteNotificationId = '';     
      }
      ).catch(
       (err) => {
         this.messageService.add({severity: 'error', summary: 'Error Message', detail: 'Somthing Wrong !! unable to delete data'});
         console.log(err);
       });

       this.NotificationData = [];
  }

  onReject() {
    this.messageService.clear('d');
  }

  onRejectSingle() {
    this.messageService.clear('d');
  }
  successMsg(){
    this.messageService.add({severity: 'success', summary: 'Success Message', detail: 'Data submitted'});
  }

  errorMsg(){
    this.messageService.add({severity: 'error', summary: 'Error Message', detail: 'Somthing Wrong !! unable to save data'});
  }


  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Unable to Load Data',
        message: message,
        buttons: ['Okay']
      }).then(alertEl => alertEl.present());
  }*/

}
