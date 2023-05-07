import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class MarkService {
    constructor ( private readonly appService: AppService){}

async markEmailSeen(uid: number): Promise<any> {
       // Select the INBOX mailbox
let lock = await this.appService.client.getMailboxLock('INBOX');

try {
  // Fetch the first message by sequence number
  let message = await this.appService.client.fetchOne(uid, { uid: true });
 if(!message.uid){
  return 'mail not found'
 }
  // Mark the message as seen
  await this.appService.client.messageFlagsAdd(message.uid, '\\Seen');
  await this.appService.client.logout();
  return "mark as seen"
} finally {
  // Release the lock
  lock.release();
}

// Log out and close the connection

    }
      
      
    // mark all seen messages as unseen 
async markEmailUnseen(uid: number): Promise<any> {
      // Select the INBOX mailbox
await this.appService.client.mailboxOpen('INBOX');

try {
  let message = await this.appService.client.fetchOne(uid, { uid: true });
  if(!message.uid){
    return 'mail not found'
  }
   // Mark the message as seen
  await this.appService.client.messageFlagsRemove(message.uid, '\\Seen');
  await this.appService.client.logout();
  return 'mark as unseen';
} catch (error) {
  return error
}

// Log out and close the connection

    }
}
