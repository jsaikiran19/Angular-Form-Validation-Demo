import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-forms';
  signUpForm: FormGroup;
  userInputs: { controlName: string; errorMsg: Function; placeholder:string }[];
  status: string;

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required,Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, this.matchPasswords());

    this.userInputs = [
      {
        controlName: 'name',
        errorMsg: this.getErrorMsg.bind(this,'name'),
        placeholder:'Name'
      },
      {
        controlName:'email',
        errorMsg: this.getErrorMsg.bind(this,'email'),
        placeholder:'Email'
      },
      {
        controlName:'password',
        errorMsg:this.getErrorMsg.bind(this,'password'),
        placeholder:'Password'
      },
      {
        controlName:'confirmPassword',
        errorMsg:this.getErrorMsg.bind(this,'confirmPassword'),
        placeholder:'Confirm Password'
      }
    ];

  }

  getControl(controlName: string): AbstractControl {
    return this.signUpForm.get(controlName);
  }

  matchPasswords(): ValidatorFn {
    return (control: AbstractControl): any => {
      const password = control.get('password').value;
      const confirmPassword = control.get('confirmPassword').value;
      return password && confirmPassword && password.toLowerCase() !== confirmPassword.toLowerCase() && control.get('confirmPassword').setErrors({ dontMatch: true })
    }
  }

  getErrorMsg(key:string): string {
    switch (key) {
      case 'name': 
      return this.nameErrorMsg()
      case 'email': 
      return this.emailErrorMsg()
      case 'password': 
      return this.passwordErrorMsg()
      case 'confirmPassword':
        return this.confirmPasswordErrMsg()
    }
  }

  emailErrorMsg(): string {
    const email = this.getControl('email');
    return email.errors && (email.errors.required ? 'Email Required' : 'Enter Valid Email');
  }

  nameErrorMsg(): string {
    const name = this.getControl('name');
    return name.errors && name.errors.required && 'Name Required';
  }


  passwordErrorMsg(): string {
    const password = this.getControl('password');
    return password.errors && (password.errors.required ? 'Password Required' : 'Password should atleast be 8 characters');
  }

  confirmPasswordErrMsg(): string {
    const confirmPassword = this.getControl('confirmPassword');
    return confirmPassword.errors && (confirmPassword.errors.required ? 'Re-enter Password' : 'Passwords do not match');
  }

  get errors(): boolean {
    return Object.keys(this.signUpForm.controls).some(control => this.signUpForm.get(control).errors)
  }
}
