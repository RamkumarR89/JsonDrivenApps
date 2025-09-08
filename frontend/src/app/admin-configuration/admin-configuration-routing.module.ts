import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseDefinitionComponent } from './components/baseconfiguration/base-definition/base-definition.component';

const routes: Routes = [
  { path: 'basedefinition', component: BaseDefinitionComponent },
  { path: 'basedefinition/edit/:id', component: BaseDefinitionComponent },
  { path: 'addrupdatedefinition', loadComponent: () => import('./components/baseconfiguration/base-definition/add-update-definition/add-update-definition.component').then(m => m.AddUpdateDefinitionComponent) },
  { path: 'addrupdatedefinition/:id', loadComponent: () => import('./components/baseconfiguration/base-definition/add-update-definition/add-update-definition.component').then(m => m.AddUpdateDefinitionComponent) },
  { path: 'basedata/:id', component: BaseDefinitionComponent },
  // { path: '', component: AdminConfigurationDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminConfigurationRoutingModule {}
