// 📄 ไฟล์นี้ทำหน้าที่: กำหนดเส้นทาง (route) ของทุกหน้าในแอดมิน ว่า path ไหนโหลดคอมโพเนนต์ไหน
// และหน้าไหนต้องผ่าน authGuard/roleGuard ก่อนเข้าได้
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'members',
        loadComponent: () => import('./features/members/members').then((m) => m.Members),
      },
      {
        path: 'members/:id',
        loadComponent: () =>
          import('./features/members/member-detail/member-detail').then((m) => m.MemberDetail),
      },
      {
        path: 'owners',
        loadComponent: () =>
          import('./features/pending-owners/pending-owners').then((m) => m.PendingOwners),
      },
      {
        path: 'owners/:id',
        loadComponent: () =>
          import('./features/pending-owners/owner-detail/owner-detail').then(
            (m) => m.OwnerDetail,
          ),
      },
      {
        path: 'dormitories',
        loadComponent: () =>
          import('./features/dormitories/dormitories').then((m) => m.Dormitories),
      },
      {
        path: 'dormitories/:id',
        loadComponent: () =>
          import('./features/dormitories/dormitory-detail/dormitory-detail').then(
            (m) => m.DormitoryDetail,
          ),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports').then((m) => m.Reports),
      },
      {
        path: 'reports/:id',
        loadComponent: () =>
          import('./features/reports/report-detail/report-detail').then((m) => m.ReportDetail),
      },
      {
        path: 'facilities',
        loadComponent: () =>
          import('./features/facilities/facilities').then((m) => m.FacilitiesPage),
      },
      {
        path: 'manage-admins',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/manage-admins/manage-admins').then((m) => m.ManageAdmins),
      },
      {
        path: 'manage-admins/:id',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/manage-admins/admin-detail/admin-detail').then(
            (m) => m.AdminDetail,
          ),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileScreen),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
