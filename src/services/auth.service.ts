import { inject, Injectable } from '@angular/core';
import { StorageKeyEnum } from '../enums/storage-keys';
import { catchError } from 'rxjs';
import { ApiService } from './api-service.service';
import { EncryptionService } from './encryption.service';
import { RequestTypes } from '../enums/request-types';
import { AlgorithmNames } from '../enums/algorithm-names';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface AuthSessionDto {
  SessionId: string;
  AccessToken: string;
  RefreshToken: string;
  UserId: string;
  Username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private accessToken: string | null = null;

  private route = inject(Router);

  /**
   * Установить значение токена доступа
   */
  public set setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Получить значение токена доступа
   */
  public get getAccessToken(): string | null {
    return this.accessToken;
  }

  constructor(
    private readonly apiService: ApiService,
    private readonly encryptionService: EncryptionService,
  ) {}

  public login(dto: AuthSessionDto): void {
    // AccessToken — максимально безопасно: только в памяти (не localStorage)
    this.accessToken = dto.AccessToken;

    // RefreshToken и данные сессии — в sessionStorage (переживает refresh страницы, но очищается при закрытии вкладки)
    sessionStorage.setItem(StorageKeyEnum.REFRESH_TOKEN_KEY, dto.RefreshToken);

    sessionStorage.setItem(
      StorageKeyEnum.SESSION_KEY,
      JSON.stringify({
        sessionId: dto.SessionId,
        userId: dto.UserId,
        username: dto.Username,
      })
    );
  }

  public logout(): void {
    // очищаем AccessToken из памяти
    this.accessToken = null;

    // удаляем всё сохранённое
    sessionStorage.removeItem(StorageKeyEnum.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(StorageKeyEnum.SESSION_KEY);
  }

  /**
   * Обновить токен доступа
   * @returns 
   */
  public async refreshAccessToken(): Promise<void> {
    const refresh = sessionStorage.getItem(StorageKeyEnum.REFRESH_TOKEN_KEY);
    
    if (!refresh) {
      return;
    }

    const { requestBody, keyAES } = await this.encryptionService.prepareObjectToSendPost(refresh, RequestTypes.REFRESH);

    const request = await this.apiService.post<string>('auth/refresh', requestBody);

    request.pipe(
      catchError(() => {
      this.logout();
      this.route.navigate(['auth/login']);

      return [];
    })
    ).subscribe(async (res) => {
      const decryptedResponse = await this.encryptionService.decrypt({
          iv: requestBody.iv,
          cipherText: res,
        },
        AlgorithmNames.CBC,
        keyAES
      );

      this.login(JSON.parse(decryptedResponse))
    });
  }
}
