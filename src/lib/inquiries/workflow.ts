import type { InquiryActivityType, InquiryWorkflowStatus } from '@/types';
import { INQUIRY_STATUSES, TERMINAL_INQUIRY_STATUSES } from './status';

export const INQUIRY_ACTIVITY_TYPES = [
  'INQUIRY_CREATED',
  'STATUS_CHANGED',
  'ADMIN_NOTE_ADDED',
  'ADMIN_UPDATED',
  'WORKFLOW_EVENT',
] as const satisfies readonly InquiryActivityType[];

export const INQUIRY_STATUS_TRANSITIONS: Record<InquiryWorkflowStatus, InquiryWorkflowStatus[]> = {
  NEW: ['CONTACTED', 'REJECTED', 'CLOSED'],
  CONTACTED: ['IN_DISCUSSION', 'MATCHED', 'REJECTED', 'CLOSED'],
  IN_DISCUSSION: ['MATCHED', 'REJECTED', 'CLOSED', 'CONTACTED'],
  MATCHED: ['CLOSED'],
  CLOSED: [],
  REJECTED: [],
};

export function canTransitionInquiryStatus(from: InquiryWorkflowStatus, to: InquiryWorkflowStatus): boolean {
  if (from === to) return true;
  return INQUIRY_STATUS_TRANSITIONS[from].includes(to);
}

export function getAvailableInquiryTransitions(status: InquiryWorkflowStatus): InquiryWorkflowStatus[] {
  return INQUIRY_STATUS_TRANSITIONS[status];
}

export function isTerminalInquiryStatus(status: InquiryWorkflowStatus): boolean {
  return TERMINAL_INQUIRY_STATUSES.includes(status);
}

export function getWorkflowTimestampField(status: InquiryWorkflowStatus): 'contactedAt' | 'discussionStartedAt' | 'matchedAt' | 'closedAt' | 'rejectedAt' | null {
  switch (status) {
    case 'CONTACTED':
      return 'contactedAt';
    case 'IN_DISCUSSION':
      return 'discussionStartedAt';
    case 'MATCHED':
      return 'matchedAt';
    case 'CLOSED':
      return 'closedAt';
    case 'REJECTED':
      return 'rejectedAt';
    default:
      return null;
  }
}

export function normalizeInquiryStatusInput(value: string): InquiryWorkflowStatus {
  const normalized = value.toUpperCase();

  if (!INQUIRY_STATUSES.includes(normalized as InquiryWorkflowStatus)) {
    throw new Error(`Unsupported inquiry status: ${value}`);
  }

  return normalized as InquiryWorkflowStatus;
}
