import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service'

@Injectable()
export class LabelsService {
    constructor(private readonly labelService: AppService) {}
    
    async setLabelToEmail(uid: number, label: string): Promise<void> {
    
        await this.labelService.client.mailboxOpen('INBOX');
      
        // Set the label to the email with the specified UID
        await this.labelService.client.messageFlagsSet(uid, {uselabels: true}, [label]);
      
        // Disconnect from the mailbox
        await this.labelService.client.logout();
      }

      async getMessagesByLabel(label: string): Promise<any> {
        // Select the mailbox with the specified label
        await this.labelService.client.mailboxOpen(`INBOX.${label}`);
      
        // Fetch the list of UIDs in the mailbox
        const uids = await this.labelService.client.search({});
      
        const messages = [];
        for await (const message of this.labelService.client.fetch(uids, { envelope: true, source: true, threadId: true })) {
          messages.push({
            uid: message.uid,
            header: message.envelope,
            body: message.source.toString(),
            threadId: message.threadId
          });
        }
      
        // Disconnect from the IMAP server
        await this.labelService.client.logout();
      
        return messages;
      }
}
