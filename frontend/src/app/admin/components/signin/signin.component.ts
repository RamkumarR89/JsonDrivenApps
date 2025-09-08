import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserapiService } from '../../services/userapi.service';
import { AdminapiService } from '../../services/adminapi.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  constructor(
    private readonly router: Router,
    private readonly userserviceapi: UserapiService,
    private readonly adminapiService: AdminapiService
  ) {}

  @ViewChild('userform') form?: NgForm;
  userModel: any = {}; // Using any to match original template

  // Test method to check if route navigation works
  async testNavigateToConfig() {
    console.log('Testing direct navigation to admin configuration...');
    console.log('Current URL:', this.router.url);
    
    try {
      // Method 1: navigateByUrl
      console.log('Method 1: navigateByUrl');
      const success1 = await this.router.navigateByUrl('/adminconfiguration/baseconfiguration');
      console.log('navigateByUrl success:', success1);
      
      if (!success1) {
        // Method 2: navigate with array
        console.log('Method 2: navigate with array');
        const success2 = await this.router.navigate(['/adminconfiguration', 'baseconfiguration']);
        console.log('navigate array success:', success2);
        
        if (!success2) {
          // Method 3: navigate to parent first
          console.log('Method 3: navigate to parent first, then child');
          await this.router.navigate(['/adminconfiguration']);
          setTimeout(() => {
            this.router.navigate(['/adminconfiguration', 'baseconfiguration']);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  onclick() {
    debugger
    if (!this.form?.valid) {
      console.warn('Please fill all required fields');
      return;
    }
    
    let encodedPassword = btoa(this.userModel.password); // encode password
    
    const response = this.userserviceapi.getbyData({
      email: this.userModel.email,
      password: encodedPassword,
    });
    
    response.subscribe({
      next: (res: any) => {
        if (res?.[0]) {
          this.userModel = res[0];
          this.adminapiService.setLoginData(this.userModel);
          console.log('Logged in successfully');
          console.log('Attempting to navigate to: /adminconfiguration/baseconfiguration');
          
          // Try navigation and handle potential errors
          this.router.navigateByUrl('/adminconfiguration/baseconfiguration').then(
            (success: boolean) => {
              console.log('Navigation success:', success);
              
              if (!success) {
                console.error('Navigation failed - route not found or navigation was prevented');
                // Fallback navigation
                this.router.navigate(['/adminconfiguration', 'baseconfiguration']).then(
                  (fallbackSuccess: boolean) => {
                    console.log('Fallback navigation success:', fallbackSuccess);
                  }
                );
              }
            }
          ).catch((error: any) => {
            console.error('Navigation error:', error);
            // Try alternative navigation method
            this.router.navigate(['/adminconfiguration', 'baseconfiguration']);
          });
        } else {
          console.warn('Login failed: Incorrect email & password');
        }
      },
      error: (error: any) => {
        console.error('Login API error:', error);
      }
    });
  }
}
