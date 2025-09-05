import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

// Import services
import { AdminapiService } from './services/adminapi.service';
import { UserapiService } from './services/userapi.service';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  declarations: [
    // No components declared here since we're using lazy loading
  ],
  providers: [
    AdminapiService,
    UserapiService
  ]
})
export class AdminModule {}
