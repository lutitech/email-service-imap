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

    async searchMailsByLabel(label: string) {
      // Connect and authenticate
      await this.appService.client.connect();
  
      // Select the INBOX mailbox
      let lock = await this.appService.client.getMailboxLock('INBOX');
  
      try {
        // Search for messages with the given label
        let results = await this.appService.client.search({ labels: [label]});
  
        // Fetch the envelope and body of the messages
        let messages = [];
        for await (let msg of this.appService.client.fetch(results, { envelope: true, bodyStructure: true,  labels: true })) {
          messages.push(msg);
        }
  
        // Return the messages array
        return messages;
      } finally {
        // Release the lock
        lock.release();
      }
    }
}  
    


