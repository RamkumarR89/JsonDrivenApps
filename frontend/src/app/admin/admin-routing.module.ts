import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout.component').then(c => c.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
      },
      {
        path: 'signin',
        loadComponent: () => import('./components/signin.component').then(c => c.SigninComponent)
      },
      {
        path: 'signup', 
        loadComponent: () => import('./components/signup.component').then(c => c.SignupComponent)
      },
      {
        path: 'error',
        loadComponent: () => import('./components/error.component').then(c => c.ErrorComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
