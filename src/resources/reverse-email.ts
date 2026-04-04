import { HttpClient, toSnakeCase, toCamelCase } from '../client';
import { pollUntilDone, isNotPending } from '../utils/polling';
import type {
  ReverseEmailParams,
  ReverseEmailResult,
  ReverseEmailBulkParams,
  ReverseEmailBulkResponse,
  ReverseEmailBulkResult,
  PollOptions,
} from '../types';

export class ReverseEmail {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async find(params: ReverseEmailParams, options?: PollOptions): Promise<ReverseEmailResult> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/reverse-email/single', body);
    const parsed = toCamelCase(result) as ReverseEmailResult;

    if (options?.waitForResult && !isNotPending(parsed)) {
      return pollUntilDone(() => this.get(parsed.id), isNotPending, options);
    }

    return parsed;
  }

  async get(id: string): Promise<ReverseEmailResult> {
    const result = await this.http.get<unknown>(`/reverse-email/single/${id}`);
    return toCamelCase(result) as ReverseEmailResult;
  }

  async findBulk(params: ReverseEmailBulkParams): Promise<ReverseEmailBulkResponse> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/reverse-email/bulk', body);
    return toCamelCase(result) as ReverseEmailBulkResponse;
  }

  async getBulk(id: string): Promise<ReverseEmailBulkResult> {
    const result = await this.http.get<unknown>(`/reverse-email/bulk/${id}`);
    return toCamelCase(result) as ReverseEmailBulkResult;
  }
}
