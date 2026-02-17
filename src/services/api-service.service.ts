import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from '../enums/request-types';

/**
 * Общая структура пакета запроса/ответа внутри клиента.
 * @interface IGeneralPackageTemplate
 */
interface IGeneralPackageTemplate {
  /** Уникальный идентификатор запроса (UUID). */
  requestId: string;
  /** Закодированное содержимое (обычно зашифрованное тело). */
  content: string;
  /** Тип запроса из перечисления `RequestTypes`. */
  type: RequestTypes;
  /** AES-ключ, используемый для шифрования содержимого. */
  aesKey: string;
  /** Вектор инициализации для AES. */
  iv: string | null;
  /** Хеш суммы пакета для целостности. */
  hash: string;
}

export type TPostRequestBody = Omit<IGeneralPackageTemplate, 'hash' | 'requestId'>;

/**
 * Сервис для выполнения HTTP-запросов к серверному API.
 * Оборачивает `HttpClient` и предоставляет удобные методы `get` и `post`.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /** Базовый URL для всех запросов API. */
  private readonly baseUrl = 'https://localhost:32773/api/';

  /**
   * Создаёт экземпляр `ApiService`.
   * @param http Инстанс `HttpClient` для выполнения HTTP-запросов.
   */
  constructor(private http: HttpClient) {}

  /**
   * Выполняет GET-запрос к API.
   * @template T Тип ожидаемого ответа.
   * @param url Относительный путь к ресурсу (добавляется к `baseUrl`).
   * @param params Опциональные параметры запроса в виде словаря.
   * @returns `Observable` с результатом запроса типа `T`.
   */
  public get<T>(
    url: string,
    params?: Record<string, string | number | boolean>
  ): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, value.toString());
      });
    }

    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
  }

  /**
   * Выполняет POST-запрос к API. Перед отправкой автоматически добавляет
   * `requestId` в тело запроса.
   * @template T Тип ожидаемого ответа.
   * @param url Относительный путь к ресурсу (добавляется к `baseUrl`).
   * @param body Тело запроса, соответствующее `IGeneralPackageTemplate`.
   * @returns Промис с `Observable` с результатом запроса типа `T`.
   */
  public async post<T>(url: string, body: TPostRequestBody): Promise<Observable<T>> {
    const requestId = this.getUUIDString();
    const hash = await this.getObjectHash({
      ...body,
      requestId,
    });

    const prepareBody = {
      ...body,
      requestId,
      hash
    };

    return this.http.post<T>(`${this.baseUrl}${url}`, prepareBody);
  }

  /**
   * Генерирует и возвращает UUID v4 строкой.
   * Использует `crypto.randomUUID()` в окружении, где доступно.
   * @returns Сгенерированный UUID в виде строки.
   */
  private getUUIDString(): string {
    return crypto.randomUUID();
  }

  /**
   * Генерирует хеш-сумму из объекта
   * @param obj входящий объект
   * @return Промис со строкой - хешем
   */
  private async getObjectHash(obj: object): Promise<string> {
    // 1. Приводим объект к строке с сортировкой ключей
    const objectString = JSON.stringify(obj, Object.keys(obj).sort());
    
    // 2. Кодируем строку в байты (Uint8Array)
    const msgUint8 = new TextEncoder().encode(objectString);
    
    // 3. Вычисляем хэш с помощью Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    
    // 4. Превращаем ArrayBuffer в HEX-строку
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
