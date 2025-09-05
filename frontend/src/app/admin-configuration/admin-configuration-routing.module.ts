import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseDefinitionComponent } from './components/base-configuration/base-definition.component';
import { RouteTestComponent } from './components/route-test/route-test.component';

const routes: Routes = [
  { path: 'basedefinition', component: BaseDefinitionComponent },
  { path: 'basedefinition/edit/:id', component: BaseDefinitionComponent },
  { path: 'addrupdatedefinition', loadComponent: () => import('./components/base-configuration/add-update-definition.component').then(m => m.AddUpdateDefinitionComponent) },
  { path: 'addrupdatedefinition/:id', loadComponent: () => import('./components/base-configuration/add-update-definition.component').then(m => m.AddUpdateDefinitionComponent) },
  { path: 'basedata/:id', component: BaseDefinitionComponent },
  { path: 'route-test', component: RouteTestComponent },
  // { path: '', component: AdminConfigurationDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminConfigurationRoutingModule {}
