import { HttpClient, toSnakeCase, toCamelCase } from '../client';
import { pollUntilDone, isNotPending } from '../utils/polling';
import type {
  EmailFindParams,
  EmailFindResult,
  EmailFindBulkParams,
  EmailFindBulkResponse,
  EmailFindBulkResult,
  PollOptions,
} from '../types';

export class EmailFinder {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async find(params: EmailFindParams, options?: PollOptions): Promise<EmailFindResult> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/email/find/single', body);
    const parsed = toCamelCase(result) as EmailFindResult;

    if (options?.waitForResult && !isNotPending(parsed)) {
      return pollUntilDone(() => this.get(parsed.id), isNotPending, options);
    }

    return parsed;
  }

  async get(id: string): Promise<EmailFindResult> {
    const result = await this.http.get<unknown>(`/email/find/single/${id}`);
    return toCamelCase(result) as EmailFindResult;
  }

  async findBulk(params: EmailFindBulkParams): Promise<EmailFindBulkResponse> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/email/find/bulk', body);
    return toCamelCase(result) as EmailFindBulkResponse;
  }

  async getBulk(id: string): Promise<EmailFindBulkResult> {
    const result = await this.http.get<unknown>(`/email/find/bulk/${id}`);
    return toCamelCase(result) as EmailFindBulkResult;
  }
}
