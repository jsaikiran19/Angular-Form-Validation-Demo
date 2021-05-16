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
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, this.matchPasswords());

    this.userInputs = [
      {
        controlName: 'name',
        errorMsg: this.nameErrorMsg.bind(this),
        placeholder:'Name'
      },
      {
        controlName:'email',
        errorMsg: this.emailErrorMsg.bind(this),
        placeholder:'Email'
      },
      {
        controlName:'password',
        errorMsg:this.passwordErrorMsg.bind(this),
        placeholder:'Password'
      },
      {
        controlName:'confirmPassword',
        errorMsg:this.confirmPasswordErrMsg.bind(this),
        placeholder:'Confirm Password'
      }
    ];
    // this.signUpForm.valueChanges.subscribe({
    //   next:_=>this.status = 'alert-' + (!this.errorsPresent ? 'success' : 'danger')
    // })

  }

  getControl(controlName: string): AbstractControl {
    return this.signUpForm.get(controlName);
  }

  matchPasswords(): ValidatorFn {
    return (control: AbstractControl): any => {
      const password = control.get('password').value;
      const confirmPassword = control.get('confirmPassword').value;
      return password && password.length < 8 ? control.get('password').setErrors({ minLength: true }) :
        confirmPassword && confirmPassword.length < 8 ? control.get('confirmPassword').setErrors({ minLength: true }) :
          password && confirmPassword && password.toLowerCase() !== confirmPassword.toLowerCase() && control.get('confirmPassword').setErrors({ dontMatch: true })
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
    return password.errors && (password.errors.required ? 'Password Required' : password.errors.minLength && 'Password should atleast be 8 characters');
  }

  confirmPasswordErrMsg(): string {
    const confirmPassword = this.getControl('confirmPassword');
    return confirmPassword.errors && (confirmPassword.errors.required ? 'Re-enter Password' : 'Passwords do not match');
  }

  get errors(): boolean {
    return Object.keys(this.signUpForm.controls).some(control => this.signUpForm.get(control).errors)
  }
}
