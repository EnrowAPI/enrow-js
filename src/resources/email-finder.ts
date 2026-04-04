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
    const body: Record<string, unknown> = {};
    if (params.fullName) body.fullname = params.fullName;
    if (params.companyDomain) body.company_domain = params.companyDomain;
    if (params.companyName) body.company_name = params.companyName;
    if (params.settings) body.settings = toSnakeCase(params.settings);
    const result = await this.http.post<unknown>('/email/find/single', body);
    const parsed = toCamelCase(result) as EmailFindResult;

    if (options?.waitForResult && !isNotPending(parsed)) {
      return pollUntilDone(() => this.get(parsed.id), isNotPending, options);
    }

    return parsed;
  }

  async get(id: string): Promise<EmailFindResult> {
    const result = await this.http.get<unknown>(`/email/find/single?id=${id}`);
    return toCamelCase(result) as EmailFindResult;
  }

  async findBulk(params: EmailFindBulkParams): Promise<EmailFindBulkResponse> {
    const body: Record<string, unknown> = {
      searches: params.searches.map((s) => {
        const item: Record<string, unknown> = {};
        if (s.fullName) item.fullname = s.fullName;
        if (s.companyDomain) item.company_domain = s.companyDomain;
        if (s.companyName) item.company_name = s.companyName;
        if (s.custom) item.custom = s.custom;
        return item;
      }),
    };
    if (params.settings) body.settings = toSnakeCase(params.settings);
    const result = await this.http.post<unknown>('/email/find/bulk', body);
    return toCamelCase(result) as EmailFindBulkResponse;
  }

  async getBulk(id: string): Promise<EmailFindBulkResult> {
    const result = await this.http.get<unknown>(`/email/find/bulk?id=${id}`);
    return toCamelCase(result) as EmailFindBulkResult;
  }
}
