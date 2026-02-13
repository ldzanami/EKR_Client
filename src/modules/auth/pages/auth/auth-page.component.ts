import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api-service.service';
import { finalize } from 'rxjs';
import { RequestTypes } from '../../../../enums/request-types';
import { EncryptionService } from '../../../../services/encryption.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPage {
  public form: FormGroup;

  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const requsestBody = await this.encryptionService.prepareObjectToSendPost(this.form.value, RequestTypes.AUTH);

    const regiterRequest = await this.apiService.post('auth/auth', requsestBody);

    regiterRequest.subscribe(() => {
      this.router.navigateByUrl('default');
    });
  }
}
