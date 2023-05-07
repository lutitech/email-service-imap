import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service'

@Injectable()
export class LabelsService {
    constructor(private readonly appService: AppService) {}
    
    async setLabel(uid: number, label: string) {
      // Get a lock on the INBOX mailbox
      let lock = await this.appService.client.getMailboxLock('INBOX');
  
      try {
        // Set the label to the message using the messageLabelsAdd method
        await this.appService.client.messageFlagsAdd(uid, label);
      } finally {
        // Release the lock
        lock.release();
      }
    }

    async getMessagesByLabel(label: string): Promise<any> {
      let lock = await this.appService.client.getMailboxLock('INBOX');
    
      try {
        // Fetch messages that have the label in the labels field
        let messages = [];
        for await (let msg of this.appService.client.fetch(
          { labels: label },
          { envelope: true, uid: true }
        )) {
          messages.push(msg);
        }
    console.log(messages)
        // Return the messages, or an empty array if none were found
        return messages || [];
      } catch (error) {
        // Handle any errors that occurred in the try block
        console.error('Error fetching messages by label:', error);
      } finally {
        // Release the lock
        lock.release();
      }
    }
    
    
}

