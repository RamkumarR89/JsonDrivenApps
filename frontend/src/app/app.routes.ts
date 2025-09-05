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
        loadComponent: () => import('./admin-configuration/components/base-configuration/base-configuration.component').then(c => c.BaseConfigurationComponent)
      },
      {
        path: 'baseconfiguration/create',
        loadComponent: () => import('./admin-configuration/components/create-component/create-component.component').then(c => c.CreateComponentComponent)
      },
      {
        path: 'baseconfiguration/edit/:id',
        loadComponent: () => import('./admin-configuration/components/create-component/create-component.component').then(c => c.CreateComponentComponent)
      },
      {
        path: 'basedefinition',
        loadComponent: () => import('./admin-configuration/components/base-configuration/base-definition.component').then(c => c.BaseDefinitionComponent)
      },
      {
        path: 'basedefinition/edit/:id',
        loadComponent: () => import('./admin-configuration/components/base-configuration/base-definition.component').then(c => c.BaseDefinitionComponent)
      },
      {
        path: 'addrupdatedefinition',
        loadComponent: () => import('./admin-configuration/components/base-configuration/add-update-definition.component').then(c => c.AddUpdateDefinitionComponent)
      },
      {
        path: 'addrupdatedefinition/:id',
        loadComponent: () => import('./admin-configuration/components/base-configuration/add-update-definition.component').then(c => c.AddUpdateDefinitionComponent)
      },
      {
        path: 'basedata/:id',
        loadComponent: () => import('./admin-configuration/components/base-configuration/base-data.component').then(c => c.BaseDataComponent)
      },
      {
        path: 'route-test',
        loadComponent: () => import('./admin-configuration/components/route-test/route-test.component').then(c => c.RouteTestComponent)
      },
      {
        path: 'debug',
        loadComponent: () => import('./admin-configuration/components/debug/route-debug.component').then(c => c.RouteDebugComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
