import { HttpClient, toSnakeCase, toCamelCase } from '../client';
import { pollUntilDone, isNotPending } from '../utils/polling';
import type {
  PhoneFindParams,
  PhoneFindResponse,
  PhoneFindResult,
  PhoneFindBulkParams,
  PhoneBulkResponse,
  PhoneBulkResult,
  PollOptions,
} from '../types';

export class PhoneFinder {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async find(params: PhoneFindParams, options?: PollOptions): Promise<PhoneFindResponse | PhoneFindResult> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/phone/single', body);
    const parsed = toCamelCase(result) as PhoneFindResponse;

    if (options?.waitForResult) {
      return pollUntilDone(
        () => this.get(parsed.id),
        (r) => r.qualification !== 'ongoing',
        options
      );
    }

    return parsed;
  }

  async get(id: string): Promise<PhoneFindResult> {
    const result = await this.http.get<unknown>(`/phone/single?id=${id}`);
    return toCamelCase(result) as PhoneFindResult;
  }

  async findBulk(params: PhoneFindBulkParams): Promise<PhoneBulkResponse> {
    const body = toSnakeCase(params);
    const result = await this.http.post<unknown>('/phone/bulk', body);
    return toCamelCase(result) as PhoneBulkResponse;
  }

  async getBulk(id: string): Promise<PhoneBulkResult> {
    const result = await this.http.get<unknown>(`/phone/bulk?id=${id}`);
    return toCamelCase(result) as PhoneBulkResult;
  }
}
