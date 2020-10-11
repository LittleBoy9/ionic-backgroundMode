import { Component, Input, OnInit } from '@angular/core';
import { StvideoService } from '../stvideo.service';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from '@angular/fire/database';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { interval } from 'rxjs';


@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})


export class VideoPage implements OnInit {
  
  thumbnail;
  isLoading = false;
  user: string;
  videoId;
  userId;
  message: string = ''
  messages = [];
  name;
  link;
  firstLoad = true;
  userName: any;
  userType: string;
  link_id: string;
  visitor: boolean;



  YT;
  video;
  player;
  reframed;
  currentState: any;
  totalTime: any;
  playerCurrentTime: number;
  playerTimeDifference: number;
  playerTimePercent: number;
  progressbarValue: number = 0;
  mobile: boolean;
  videoLoaded: boolean = false;
  autochange: boolean = false;
  focus: boolean = false;
  progressbaroldValue: number;
  fullscreenWindow = false;
  constructor(private router: Router,
    private route: ActivatedRoute, private db: AngularFireDatabase, private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController, private _stvideo: StvideoService, private Platform: Platform,  ) {

     }

  ngOnInit() {

    if (this.Platform.is('mobile')) {
      this.mobile = true;
      }
    this.route.paramMap.subscribe(paramMap => {
      this.videoId = paramMap.get('videoId');
      this.link_id =   paramMap.get('linkId');
      });


    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    



      this.loadmessage();
     console.log(this.link_id)
     const displayname = JSON.parse(localStorage.getItem('_cap_authData')).displayName;
     const  useremail = JSON.parse(localStorage.getItem('_cap_authData')).email;

       this.userType = "student";
       this.isLoading = true;
       this.loadingCtrl
       .create({ keyboardClose: true})
       .then(loadingEl => {
         loadingEl.present();
         let table;
         if (JSON.parse(localStorage.getItem('_cap_authData')).displayName.indexOf('V') != -1) {
           table = '/registered';
           this.visitor = true;
           } else {
             table = '/student';
             this.visitor = false;
           }
       this._stvideo.getDataforValue(table, 'email', useremail).subscribe(data => {
         console.log(data[0]['name']);
         this.userName = data[0]['name'];
         this.userId =  data[0]['student_id'];
         loadingEl.dismiss();
      });
     });

     interval(100).subscribe(x => {
      this.updatetime();
    });
 }

 ionViewWillEnter(){
  console.log('ON view will enter');
 
   
   }

  loadmessage() {
   console.log(this.link_id); 
   this._stvideo.getDataforValue('/tut_video', 'link_id' , Number(this.link_id)).subscribe(data => {
     console.log(data);
     
     this.startVideo(data[0]['link']);
    
          if (data.length > 0) {
 
 if (data[0]['chat'] != undefined) {
 console.log('inside');

       this.messages  = data[0]['chat'];
 }
 if (this.firstLoad) {
 
   this.firstLoad = false;
 this.link = data[0]['link'];   

  this.link = this.sanitizer.bypassSecurityTrustResourceUrl(this.link );
 }
       this.name = data[0]['title'];
 }
   });
  }



  sendMessage() {
    if(this.message !='' && this.message != undefined){
    this.messages.push({
      userId: this.userId,
      userName: this.userName,
      userType: this.userType,
      message: this.message,
     timestamp: new Date()
    })
    const data = {
      chat: this.messages
    };
    const path = '/tut_video' + '/' + this.videoId;
    console.log('path' + path);
    this._stvideo.updateData(path , data )
    .then(() => {
      this.message = ''
    })
  
  }
  }



  startVideo(link){
    console.log('start video');
    this.reframed = true;
console.log(link);
const videoID = link.split('embed/')[1].split('?version')[0]
console.log(window['YT']);
if(window['YT'] != undefined){
    this.player = new window['YT'].Player('player',{
      
      videoId :videoID,
      host: 'https://www.youtube.com',
      frameborder: 0,
      playerVars : {
        autoplay : 1,
        version : 3,
        loop : 1,
        playlist : videoID,
        modestbranding : 1,
        playsinline : 1,
        controls: 0
      },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange' : this.onPlayerStateChange.bind(this),
      }
    })
  }
  else{ 
    window['onYouTubeIframeAPIReady'] = () => this.startVideo(link);
  }
  }

  onPlayerReady(event){
    this.videoLoaded = true;
    console.log(event);
     this.totalTime = this.player.getDuration();
    this.player.playVideo();//won't work on mobile


  }
  fullScreen(){
    var elem = document.getElementById("iframeContainer");
    console.log(elem)
    console.log(this.fullscreenWindow);
    if(!this.fullscreenWindow) {
      this.fullscreenWindow = true;
    this.player.playVideo();
    
   
  //    var iframe = this.player.getIframe()
  //   var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen
  //    if (requestFullScreen) {
  //  requestFullScreen.bind(iframe)()
  //    }


    document.getElementById("player").style.height = "100%";
    document.getElementById("player").style.width = "100%";
    document.getElementById("toolbar").style['margin-top'] = "-50px";
    if (elem['requestFullscreen']) {
      elem['requestFullscreen']();
    } else if (elem['mozRequestFullScreen']) {
      /* Firefox */
      elem['mozRequestFullScreen']();
    } else if (elem['webkitRequestFullscreen']) {
      /* Chrome, Safari & Opera */
      elem['webkitRequestFullscreen']();
    } else if (elem['msRequestFullscreen']) {
      /* IE/Edge */
      elem['msRequestFullscreen']();
    }
  } else {
    this.fullscreenWindow = false;
    document.getElementById("player").style.height = "300px";
    document.getElementById("toolbar").style['margin-top'] = "-80px";

    if (document['exitFullscreen']) {
      document['exitFullscreen']();
   } else if (document['webkitExitFullscreen']) {
    document['webkitExitFullscreen']();
   } else if (document['mozCancelFullScreen']) {
    document['mozCancelFullScreen']();
   } else if (document['msExitFullscreen']) {
    document['msExitFullscreen']();
   }
  }
  }
  onPlayerStateChange(event){
    console.log(event);
    this.currentState = event.data;
  }

  playpause() {
   console.log(window['YT'].PlayerState);
  
   if (this.currentState == window['YT'].PlayerState.PLAYING ) {
      this.player.pauseVideo();
   } else if (this.currentState == window['YT'].PlayerState.PAUSED || this.currentState ==3) {
    this.player.playVideo();
   }  else {
    this.player.playVideo();
   }
  }



  ProgressBar(event){
    if(this.progressbaroldValue +1 != event.detail.value){
    console.log(event);
console.log( this.focus)

    const seconds = (event.detail.value/100)* this.totalTime;
     this.playerCurrentTime = Math.round(this.player.getCurrentTime());
     this.playerCurrentTime = seconds;
    
 this.player.seekTo(seconds, true);
    this.focus = false;
    }
  }
updatetime(){
  this.autochange = false;
  const oldtime = this.playerCurrentTime;
  if(this.player && this.player.getCurrentTime ) {
    this.playerCurrentTime = this.player.getCurrentTime();
  }
  if(this.playerCurrentTime !== oldtime) { 
    this.progressbaroldValue =    this.progressbarValue;
   this.progressbarValue = Math.round((this.playerCurrentTime/this.totalTime)*100);
    console.log(  this.progressbarValue);
    this.autochange = true;
  }
}
  
}
