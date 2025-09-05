import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import services only - components are now standalone
import { BaseConfigurationapiService } from './services/base-configurationapi.service';
import { MasterBaseConfigurationapiService } from './services/master-base-configurationapi.service';
import { BaseDefinitionService } from './services/base-definition.service';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [
    // No components declared - all are standalone
  ],
  providers: [
    BaseConfigurationapiService,
    MasterBaseConfigurationapiService,
    BaseDefinitionService
  ],
  exports: [
    // No components exported - they are imported directly as standalone
  ]
})
export class AdminConfigurationModule {}
