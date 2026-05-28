import type { NotificationEnvelope, NotificationTransport } from './types';

export class ConsoleNotificationTransport implements NotificationTransport {
  async send<TPayload>(envelope: NotificationEnvelope<TPayload>): Promise<void> {
    console.info('[notifications]', JSON.stringify(envelope, null, 2));
  }
}
