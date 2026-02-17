import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api-service.service';
import { RequestTypes } from '../../../../enums/request-types';
import { EncryptionService } from '../../../../services/encryption.service';
import { AlgorithmNames } from '../../../../enums/algorithm-names';
import { StorageKeyEnum } from '../../../../enums/storage-keys';

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

    const initialData = {
      username: this.form.value.username,
      password: this.form.value.password,
      connectionInfo: {
        ip: '185.11.63.138',
        browser: navigator.userAgent,
        osDescription: navigator.platform,
        refreshToken: sessionStorage.getItem(StorageKeyEnum.SESSION_KEY),
      }
    }

    const { requestBody, keyAES } = await this.encryptionService.prepareObjectToSendPost(initialData, RequestTypes.AUTH);

    const regiterRequest = await this.apiService.post<string>('auth/auth', requestBody);

    regiterRequest.subscribe(async (res) => {
      // const decryptedResponse = await this.encryptionService.decrypt({
      //     iv: requestBody.iv,
      //     cipherText: res,
      //   },
      //   AlgorithmNames.CBC,
      //   keyAES
      // );

      this.router.navigateByUrl('default');
    });
  }
}
