import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EncryptionService } from '../../../../services/encryption.service';
import { AlgorithmNames } from '../../../../enums/algorithm-names';
import { ApiService } from '../../../../services/api-service.service';
import { RequestTypes } from '../../../../enums/request-types';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPage {
  public form: FormGroup;

  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private readonly encryptionService: EncryptionService,
    private readonly apiService: ApiService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  public async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword, username } = this.form.value;

    if (password !== confirmPassword) {
      return;
    }

    const { requestBody } = await this.encryptionService.prepareObjectToSendPost({ username, password }, RequestTypes.REGISTER);

    const regiterRequest = await this.apiService.post('auth/register', requestBody);

    regiterRequest.subscribe(() => {
      this.router.navigateByUrl('auth/login');
    });
  }
}
