import { HttpClient, toCamelCase } from '../client';
import type { AccountInfo } from '../types';

export class Account {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async info(): Promise<AccountInfo> {
    const result = await this.http.get<unknown>('/account/info');
    return toCamelCase(result) as AccountInfo;
  }
}
