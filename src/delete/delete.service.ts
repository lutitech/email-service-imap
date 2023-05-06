import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
export class DeleteService {
    constructor(private readonly appService: AppService){}

    async deleteEmail(uid: number): Promise<any> {
        // Select the mailbox containing the email
        await this.appService.client.mailboxOpen('INBOX');
        const uids = await this.appService.client.search(uid);
        // Mark the email with the specified UID as deleted
        const deletemail = await this.appService.client.messageDelete(uids);
          // Disconnect from the IMAP server
        await this.appService.client.logout();
        return {
          deletemail,
          message: 'deleted sucessfully'
    
        }
      }
}
