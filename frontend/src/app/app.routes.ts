import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(c => c.HomeComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'adminconfiguration',
    loadComponent: () => import('./admin-configuration/components/layout/admin-layout/simple-admin-layout.component').then(c => c.AdminConfigurationLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'baseconfiguration',
        pathMatch: 'full'
      },
      {
        path: 'baseconfiguration',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-component/base-configuration.component').then(c => c.BaseConfigurationComponent)
      },
      {
        path: 'baseconfiguration/create',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-component/create-component/create-component.component').then(c => c.CreateComponentComponent)
      },
      {
        path: 'baseconfiguration/edit/:id',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-component/create-component/create-component.component').then(c => c.CreateComponentComponent)
      },
      {
        path: 'basedefinition',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-definition/base-definition.component').then(c => c.BaseDefinitionComponent)
      },
      {
        path: 'basedefinition/edit/:id',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-definition/base-definition.component').then(c => c.BaseDefinitionComponent)
      },
      {
        path: 'addrupdatedefinition',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-definition/add-update-definition/add-update-definition.component').then(c => c.AddUpdateDefinitionComponent)
      },
      {
        path: 'addrupdatedefinition/:id',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-definition/add-update-definition/add-update-definition.component').then(c => c.AddUpdateDefinitionComponent)
      },
      {
        path: 'basedata/:id',
        loadComponent: () => import('./admin-configuration/components/baseconfiguration/base-data/base-data.component').then(c => c.BaseDataComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
