import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  {
    path: 'stvideo',
    loadChildren: './stvideo/stvideo.module#StvideoPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'video/:videoId/:linkId', loadChildren: './stvideo/video/video.module#VideoPageModule' },
 

  { path: 'parentstudent',
  loadChildren: './parentstudent/parentstudent.module#ParentstudentPageModule',
  canLoad: [AuthGuard]
},
  { path: 'dashboard',
  loadChildren: './parentstudent/dashboard/dashboard.module#DashboardPageModule' ,
  canLoad: [AuthGuard]},
  { path: 'exam',
   loadChildren: './parentstudent/exam/exam.module#ExamPageModule' },
  { path: 'attendance',
  loadChildren: './parentstudent/attendance/attendance.module#AttendancePageModule' },
  { path: 'exam-detail/:studentId/:class_id/:studentName',
  loadChildren: './parentstudent/exam/exam-detail/exam-detail.module#ExamDetailPageModule' },
  { path: 'attendance-detail/:studentId/:studentName',
  loadChildren: './parentstudent/attendance/attendance-detail/attendance-detail.module#AttendanceDetailPageModule' },
  { path: 'fee', loadChildren: './parentstudent/fee/fee.module#FeePageModule' },
  { path: 'fee-detail/:studentId/:studentName/:total/:totalpaid', 
  loadChildren: './parentstudent/fee/fee-detail/fee-detail.module#FeeDetailPageModule' },
  { path: 'homework', loadChildren: './parentstudent/homework/homework.module#HomeworkPageModule' },
  { path: 'timetable', loadChildren: './parentstudent/timetable/timetable.module#TimetablePageModule' },
  { path: 'timetable-detail/:class_id/:studentName',
  loadChildren: './parentstudent/timetable/timetable-detail/timetable-detail.module#TimetableDetailPageModule' },
  { path: 'signup', loadChildren: './auth/signup/signup.module#SignupPageModule' },
  { path: 'teacher', loadChildren: './parentstudent/teacher/teacher.module#TeacherPageModule' },
  { path: 'subject', loadChildren: './parentstudent/subject/subject.module#SubjectPageModule' },
  { path: 'subject-detail/:studentId/:class_id/:studentName', 
  loadChildren: './parentstudent/subject/subject-detail/subject-detail.module#SubjectDetailPageModule' },  { path: 'notification', loadChildren: './parentstudent/notification/notification.module#NotificationPageModule' },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
