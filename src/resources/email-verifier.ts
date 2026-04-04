import { HttpClient, toSnakeCase, toCamelCase } from '../client';
import type {
  VerifySingleParams,
  VerifySingleResult,
  VerifyBulkParams,
  VerifyBulkResponse,
  VerifyBulkResult,
} from '../types';

export class EmailVerifier {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async single(params: VerifySingleParams): Promise<VerifySingleResult> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/email/verify/single', body);
    return toCamelCase(result) as VerifySingleResult;
  }

  async get(id: string): Promise<VerifySingleResult> {
    const result = await this.http.get<unknown>(`/email/verify/single?id=${id}`);
    return toCamelCase(result) as VerifySingleResult;
  }

  async bulk(params: VerifyBulkParams): Promise<VerifyBulkResponse> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/email/verify/bulk', body);
    return toCamelCase(result) as VerifyBulkResponse;
  }

  async getBulk(id: string): Promise<VerifyBulkResult> {
    const result = await this.http.get<unknown>(`/email/verify/bulk?id=${id}`);
    return toCamelCase(result) as VerifyBulkResult;
  }
}
