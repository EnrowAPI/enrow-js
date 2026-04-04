// ── Common ──

export interface Company {
  name: string;
  domain: string;
}

export interface RequestSettings {
  countryCode?: string;
  webhook?: string;
}

// ── Email Finder ──

export interface EmailFindParams {
  companyDomain?: string;
  companyName?: string;
  fullName: string;
  settings?: RequestSettings;
}

export interface EmailFindResult {
  id: string;
  status: 'completed' | 'pending' | 'failed';
  email: string;
  qualification: 'valid' | 'invalid';
  firstName: string;
  lastName: string;
  company: Company;
  verified: boolean;
  creditsUsed: number;
}

export interface EmailFindBulkParams {
  searches: Array<{
    companyDomain?: string;
    companyName?: string;
    fullName: string;
    custom?: Record<string, unknown>;
  }>;
  settings?: RequestSettings;
}

export interface EmailFindBulkResponse {
  batchId: string;
  total: number;
  status: string;
  creditsUsed: number;
}

export interface EmailFindBulkResult {
  batchId: string;
  status: 'completed' | 'processing' | 'partial';
  total: number;
  completed: number;
  creditsUsed: number;
  results: Array<EmailFindResult & { custom?: Record<string, unknown> }>;
}

// ── Email Verifier ──

export interface VerifySingleParams {
  email: string;
  settings?: { webhook?: string };
}

export interface VerifyChecks {
  syntaxValid: boolean;
  domainValid: boolean;
  mxFound: boolean;
  smtpValid: boolean;
  mailboxExists: boolean;
}

export interface VerifyMetadata {
  isDisposable: boolean;
  isRole: boolean;
  isFree: boolean;
  isCatchAll: boolean;
  provider: string;
}

export interface VerifySingleResult {
  id: string;
  email: string;
  qualification: 'valid' | 'invalid';
  isDeliverable: boolean;
  checks: VerifyChecks;
  metadata: VerifyMetadata;
  creditsUsed: number;
}

export interface VerifyBulkParams {
  verifications: string[];
  settings?: { webhook?: string };
  custom?: Record<string, unknown>;
}

export interface VerifyBulkResponse {
  batchId: string;
  total: number;
  status: string;
  creditsUsed: number;
}

export interface VerifyBulkResult {
  batchId: string;
  status: string;
  total: number;
  completed: number;
  creditsUsed: number;
  results: VerifySingleResult[];
}

// ── Phone Finder ──

export interface PhoneFindParams {
  linkedinUrl?: string;
  firstName?: string;
  lastName?: string;
  companyDomain?: string;
  companyName?: string;
  settings?: { webhook?: string };
}

export interface PhoneFindResponse {
  id: string;
  status: string;
  message: string;
}

export interface PhoneFindResult {
  id: string;
  qualification: 'found' | 'not_found' | 'ongoing';
  number: string;
  country: string;
}

export interface PhoneFindBulkParams {
  searches: Array<{
    linkedinUrl?: string;
    firstName?: string;
    lastName?: string;
    companyDomain?: string;
    companyName?: string;
    custom?: unknown;
  }>;
  settings?: { webhook?: string };
}

export interface PhoneBulkResponse {
  batchId: string;
  total: number;
  status: string;
}

export interface PhoneBulkResult {
  batchId: string;
  status: string;
  total: number;
  results: Array<{
    index: number;
    qualification: 'found' | 'not_found';
    number: string;
    country: string;
    custom?: unknown;
  }>;
}

// ── Reverse Email ──

export interface ReverseEmailParams {
  email: string;
  settings?: { webhook?: string };
}

export interface ReverseEmailResult {
  id: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  company: Company;
  linkedinUrl: string;
  creditsUsed: number;
}

export interface ReverseEmailBulkParams {
  emails: Array<{ email: string }>;
  settings?: { webhook?: string };
}

export interface ReverseEmailBulkResponse {
  id: string;
  status: string;
  total: number;
}

export interface ReverseEmailBulkResult {
  id: string;
  status: string;
  total: number;
  completed: number;
  creditsUsed: number;
  results: Array<{
    email: string;
    status: string;
    firstName: string;
    lastName: string;
    company: Company;
    linkedinUrl: string;
    index: number;
  }>;
}

// ── Account ──

export interface AccountInfo {
  credits: number;
}

// ── Polling ──

export interface PollOptions {
  waitForResult?: boolean;
  pollInterval?: number;
  timeout?: number;
}
