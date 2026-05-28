import type { InquiryActivity, InquiryDetail, InquiryWorkflowStatus } from '@/types';

export const NOTIFICATION_EVENTS = [
  'INQUIRY_SUBMITTED',
  'INQUIRY_STATUS_UPDATED',
  'INQUIRY_MATCHED',
  'INQUIRY_REJECTED',
  'ADMIN_NOTE_ADDED',
] as const;

export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[number];

export interface NotificationRecipient {
  email: string;
  name?: string;
  role?: string;
}

export interface NotificationMessage {
  subject: string;
  body: string;
}

export interface NotificationEnvelope<TPayload = unknown> {
  event: NotificationEvent;
  recipients: NotificationRecipient[];
  payload: TPayload;
  message: NotificationMessage;
}

export interface InquiryNotificationPayload {
  inquiry: InquiryDetail;
  activity?: InquiryActivity;
  previousStatus?: InquiryWorkflowStatus;
  nextStatus?: InquiryWorkflowStatus;
  actorName?: string;
}

export interface NotificationTransport {
  send<TPayload>(envelope: NotificationEnvelope<TPayload>): Promise<void>;
}
