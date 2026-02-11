import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api-service.service';
import { finalize } from 'rxjs';
import { RequestTypes } from '../../../../enums/request-types';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPage {
  public form: FormGroup;

  constructor(private fb: FormBuilder, private readonly api: ApiService) {
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  public onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.post('auth/auth', {
      content: 'asdasd',
      type: RequestTypes.AUTH,
      aesKey: 'asd',
      iv: 'asd',
    }).then((obs) => {
      obs.pipe(finalize(() => {
      console.log('ХУЙ');
    })).subscribe((res) => {
      console.log('res', res);
    })
    })
  }
}
