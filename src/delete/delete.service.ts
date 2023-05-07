import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
export class DeleteService {
    constructor(private readonly appService: AppService){}

    async deleteEmail(uid: number): Promise<any> {
      let lock = await this.appService.client.getMailboxLock('INBOX');

      try {
        // Fetch the first message by sequence number
        let message = await this.appService.client.fetchOne(uid, { uid: true });
      
        // Delete the message
        await this.appService.client.messageDelete(message.uid);
      } finally {
        // Release the lock
        lock.release();
      }
      
      // Log out and close the connection
      await this.appService.client.logout();
        }
 }

