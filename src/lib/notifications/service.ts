import { renderNotificationTemplate } from './templates';
import { ConsoleNotificationTransport } from './transports';
import type { InquiryNotificationPayload, NotificationEnvelope, NotificationEvent, NotificationRecipient, NotificationTransport } from './types';

export class NotificationService {
  constructor(private readonly transport: NotificationTransport = new ConsoleNotificationTransport()) {}

  async notifyInquiryEvent(event: NotificationEvent, recipients: NotificationRecipient[], payload: InquiryNotificationPayload): Promise<void> {
    if (recipients.length === 0) {
      return;
    }

    const envelope: NotificationEnvelope<InquiryNotificationPayload> = {
      event,
      recipients,
      payload,
      message: renderNotificationTemplate(event, payload),
    };

    await this.transport.send(envelope);
  }
}

export const notificationService = new NotificationService();
