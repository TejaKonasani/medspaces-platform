import { getInquiryStatusLabel } from '@/lib/inquiries';
import type { InquiryNotificationPayload, NotificationEvent, NotificationMessage } from './types';

export function renderNotificationTemplate(event: NotificationEvent, payload: InquiryNotificationPayload): NotificationMessage {
  const listingName = payload.inquiry.listing?.clinicName ?? 'MedSpaces marketplace';

  switch (event) {
    case 'INQUIRY_SUBMITTED':
      return {
        subject: `Inquiry received for ${listingName}`,
        body: `${payload.inquiry.doctorName} submitted a new inquiry for ${listingName}.`,
      };
    case 'INQUIRY_STATUS_UPDATED':
      return {
        subject: `Inquiry status updated to ${payload.nextStatus ? getInquiryStatusLabel(payload.nextStatus) : 'Updated'}`,
        body: `The inquiry for ${listingName} moved from ${payload.previousStatus ? getInquiryStatusLabel(payload.previousStatus) : 'Unknown'} to ${payload.nextStatus ? getInquiryStatusLabel(payload.nextStatus) : 'Updated'}.`,
      };
    case 'INQUIRY_MATCHED':
      return {
        subject: `Inquiry matched with ${listingName}`,
        body: `${payload.inquiry.doctorName}'s inquiry has been marked as matched for ${listingName}.`,
      };
    case 'INQUIRY_REJECTED':
      return {
        subject: `Inquiry closed as not a fit`,
        body: `The inquiry for ${listingName} has been marked as rejected.`,
      };
    case 'ADMIN_NOTE_ADDED':
      return {
        subject: `Admin note added for ${listingName}`,
        body: `An admin note was added to the inquiry for ${listingName}.`,
      };
    default:
      return {
        subject: 'MedSpaces workflow notification',
        body: `A workflow update is available for ${listingName}.`,
      };
  }
}
