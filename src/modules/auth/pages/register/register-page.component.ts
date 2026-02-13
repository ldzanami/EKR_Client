import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
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

    const formValueStr = JSON.stringify({ username, password });
    console.log('formValueStr', formValueStr);

    const keyAES = await this.encryptionService.generateAESKey();
    console.log('keyAES', keyAES);

    const keyRSA = this.encryptionService.publicKeyRSA; 
    console.log('keyRSA', keyRSA);

    const rawKey = await crypto.subtle.exportKey("raw", keyAES);

    const { cipherText, iv } = await this.encryptionService.encrypt(formValueStr, keyAES, AlgorithmNames.CBC, true);
    const encryptedKeyAES = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    keyRSA as CryptoKey,
    rawKey
  );

    const regiterRequest = await this.apiService.post('auth/register', {  
      content: cipherText,
      iv,
      aesKey: this.encryptionService.arrayBufferToBase64(encryptedKeyAES),
      type: RequestTypes.REGISTER,
    })

    regiterRequest.subscribe((res) => {
      console.log('regiterRequest_res', res);
    });
  }
}
