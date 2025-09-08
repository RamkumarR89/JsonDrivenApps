import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserapiService } from '../../services/userapi.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly userapiService: UserapiService
  ) {}

  @ViewChild('userform') form?: NgForm;
  userModel: User = { isactive: true, islocked: false };
  IsPasswordNotMatch: boolean = false;
  randomNumber: number = 0;

  ngOnInit(): void {
    // Initialize component
  }

  generateRandomNumber() {
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
  }

  onSubmit() {
    if (!this.form?.valid) {
      console.warn('Please fill all required fields');
      return;
    }
    
    this.generateRandomNumber();

    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    this.form.value.id = this.randomNumber;
    this.form.value.displayName = `${this.form.value.firstName} ${this.form.value.lastName}`;
    this.form.value.password = btoa(this.form.value.password);
    
    const now = new Date();
    this.form.value.createdOn = now.toLocaleDateString('en-US', options);

    const response = this.userapiService.postData(this.form?.value);
    response.subscribe((res: any) => {
      if (res.created) {
        console.log('User Created successfully');
        this.form?.reset();
        this.router.navigateByUrl('/admin/signin');
      } else {
        console.error('User creation failed');
      }
    });
  }

  passwordsMatch() {
    const password = this.form?.value.password;
    const confirmPassword = this.form?.value.confirmpassword;
    this.IsPasswordNotMatch = password !== confirmPassword;
  }
}
