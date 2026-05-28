import type { InquiryWorkflowStatus } from '@/types';

export const INQUIRY_STATUSES = ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'MATCHED', 'CLOSED', 'REJECTED'] as const satisfies readonly InquiryWorkflowStatus[];

export const INQUIRY_STATUS_LABELS: Record<InquiryWorkflowStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_DISCUSSION: 'In discussion',
  MATCHED: 'Matched',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
};

export const TERMINAL_INQUIRY_STATUSES: InquiryWorkflowStatus[] = ['MATCHED', 'CLOSED', 'REJECTED'];

export function isInquiryStatus(value: string): value is InquiryWorkflowStatus {
  return INQUIRY_STATUSES.includes(value as InquiryWorkflowStatus);
}

export function getInquiryStatusLabel(status: InquiryWorkflowStatus): string {
  return INQUIRY_STATUS_LABELS[status];
}
