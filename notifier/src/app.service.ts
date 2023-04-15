import { Injectable } from '@nestjs/common';
import { NewNotification } from './dtos/new.notification.dto';
import { EmailService } from './email.service';

@Injectable()
export class AppService {
  constructor(private readonly emailService: EmailService) {}
  private buildMessage(email: Omit<NewNotification, 'typeService'>) {
    let message = '';

    switch (email.typeMessage) {
      case 'NEW_USER':
        message = `Hello ${email.name}.
        
        Congratulations on your enrollment. To confirm your email and be able to access our platform, click on this link, you will be redirected to your account!
        
        ${process.env.API_GATEWAY}/auth/validation/${email.additionalInformation}`;
        break;
      case 'RECOVER_PASSWORD':
        message = 'This service is currently not available: password recovery';
        break;
      case 'LATE_PAYMENT':
        message = 'This service is currently not available: late payment';
        break;
      case 'EXPIRING_LICENSE':
        message = 'This service is currently not available: expiring license';
        break;
      default:
        console.log('Message Build error!');
    }
    return message;
  }

  private async sendEmail(email: Omit<NewNotification, 'typeService'>) {
    const message = this.buildMessage(email);
    if (email.typeMessage === 'NEW_USER') {
      await this.emailService.sendMail(
        email.recipient,
        'Email confirmation!',
        message,
      );
    }
  }

  private async sendSMS(sms: Omit<NewNotification, 'typeService'>) {
    return '';
  }

  async verifyTypes(newNotification: NewNotification) {
    if (newNotification.typeService === 'EMAIL') {
      delete newNotification.typeService;
      await this.sendEmail(newNotification);
    } else {
      delete newNotification.typeService;
      await this.sendSMS(newNotification);
    }
  }
}
