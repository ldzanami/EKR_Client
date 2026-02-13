import { Injectable } from '@angular/core';
import { ApiService } from './api-service.service';
import { AlgorithmNames } from '../enums/algorithm-names';

interface IPublicKeyResponse {
  Key: string;
  RequestId: string;
}

interface IEncryptionPayload {
  iv: string | null; cipherText: string
}

interface AlgorithmParams {
  name: AlgorithmNames,
  iv?: BufferSource | Uint8Array<ArrayBufferLike>,
}

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  /**
   * Публичный ключ шифрования RSA
  */
  public publicKeyRSA: CryptoKey | null = null

  private readonly ivLength = 16; // 16 байт для CBC

  constructor(private readonly apiService: ApiService) {}

  // -----------------------------
  // Генерация AES ключа (256 бит)
  // -----------------------------
  public async generateAESKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: AlgorithmNames.CBC,
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // -----------------------------
  // Генерация IV
  // -----------------------------
  public generateIv(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  // -----------------------------
  // Шифрование текста
  // -----------------------------
   public async encrypt(
    plainText: string,
    key: CryptoKey,
    algorithmName: AlgorithmNames,
    isUseIV?: boolean,
  ): Promise<IEncryptionPayload> {
    const iv = this.generateIv();
    const algorithm: AlgorithmParams = {
      name: algorithmName
    }

    if (isUseIV) {
      algorithm.iv = iv;
    }

    const encoded = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
      algorithm,
      key,
      encoded
    );

    return {
      iv: isUseIV ? this.arrayBufferToBase64(iv.buffer as ArrayBuffer) : null,
      cipherText: this.arrayBufferToBase64(encrypted)
    };
  }

  // -----------------------------
  // Расшифровка текста
  // -----------------------------
  public async decrypt(
    payload: IEncryptionPayload,
    algorithmName: AlgorithmNames,
    key: CryptoKey,
  ): Promise<string> {
    const iv = payload.iv ? new Uint8Array(this.base64ToArrayBuffer(payload.iv)) : null;
    const data = this.base64ToArrayBuffer(payload.cipherText);
    const algorithm: AlgorithmParams = {
      name: algorithmName
    }

    if (iv) {
      algorithm.iv = iv;
    }

    const decrypted = await crypto.subtle.decrypt(
      algorithm,
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  }

  /**
   * Получить публичный ключ шифрования
   */
  public getPublicKeyRSA(): void {
    this.apiService.get<IPublicKeyResponse>('auth/get-public-key').subscribe((res) => {
      this.importKeyRSA(res.Key)
    });
  }

  // -----------------------------
  // Utils: Base64 ↔ ArrayBuffer
  // -----------------------------
  public arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    bytes.forEach(b => (binary += String.fromCharCode(b)));

    return btoa(binary);
  }
  
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }

  /**
   * Импортировать ключ в крипто-контекст
   */
  private async importKeyRSA(key: string): Promise<void> {
    const byteKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    console.log('key', key);
    console.log('byteKey', byteKey);

    const publicKeyRSA = await window.crypto.subtle.importKey(
      'spki',
      byteKey,
      {
        name: AlgorithmNames.OAEP,
        hash: 'SHA-256',
      } as RsaHashedImportParams,
      false,
      ['encrypt']
    );

    console.log('publicKeyRSA', publicKeyRSA);

    this.publicKeyRSA = publicKeyRSA;
  }
}
