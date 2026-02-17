import { Injectable } from '@angular/core';
import { StorageKeyEnum } from '../enums/storage-keys';

export interface AuthSessionDto {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private accessToken: string | null = null;

  login(dto: AuthSessionDto): void {
    // AccessToken — максимально безопасно: только в памяти (не localStorage)
    this.accessToken = dto.accessToken;

    // RefreshToken и данные сессии — в sessionStorage (переживает refresh страницы, но очищается при закрытии вкладки)
    sessionStorage.setItem(StorageKeyEnum.REFRESH_TOKEN_KEY, dto.refreshToken);

    sessionStorage.setItem(
      StorageKeyEnum.SESSION_KEY,
      JSON.stringify({
        sessionId: dto.sessionId,
        userId: dto.userId,
        username: dto.username,
      })
    );
  }

  logout(): void {
    // очищаем AccessToken из памяти
    this.accessToken = null;

    // удаляем всё сохранённое
    sessionStorage.removeItem(StorageKeyEnum.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(StorageKeyEnum.SESSION_KEY);
  }

  // если нужно — можно добавить getter
  getAccessToken(): string | null {
    return this.accessToken;
  }
}