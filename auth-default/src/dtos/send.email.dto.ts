export class MessageForSendEmail {
  typeService: 'EMAIL' | 'SMS';
  recipient: string;
  name: string;
  typeMessage:
    | 'NEW_USER'
    | 'RECOVER_PASSWORD'
    | 'EXPIRING_LICENSE'
    | 'LATE_PAYMENT';
  additionalInformation: string;
}
