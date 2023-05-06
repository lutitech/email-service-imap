import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service'

@Injectable()
export class SearchService {
constructor( private readonly appService: AppService){}

async getMessageById(uid: number): Promise<any> {
    await this.appService.client.mailboxOpen('INBOX');
    const messages = [];
   
    for await (const message of this.appService.client.fetch(uid, { envelope: true, source: true, threadId: true  })) {
      messages.push({
        seq: message.seq,
        uid: message.uid,
        header: message.envelope,
        body: message.source.toString(),
        threadId: message.threadId
      });
    }
  
    await this.appService.client.logout();
    
    return messages;
  }
  
  
  
  
  

  async getAllMessage(page: number , limit: number ): Promise<any> {
     await this.appService.client.mailboxOpen('INBOX');
     const mailboxStatus = await this.appService.client.status('INBOX', { messages: true });
     const messages = [];
     
     for await (const message of this.appService.client.fetch('1:*', { envelope: true , unseen: true, threadId: true})) {
       messages.push({ 
        uid: message.uid,
         headers: message.envelope,
         threadId: message.threadId,
         body: message.source.toString(),
        });
     }
    return {
      messages,
      mailboxStatus,
      page,
      limit
    }
      
    
  }

  async getTotalMessages(): Promise<any> {
    

    // Select the mailbox to fetch messages 
    await this.appService.client.mailboxOpen('INBOX');

    // Get the mailbox status, which includes the total number of messages
    const mailboxStatus = await this.appService.client.status('INBOX', { messages: true });
    const unreadmailboxStatus =  await this.appService.client.status('INBOX',{unseen: true});

      // Disconnect from the IMAP server
    await this.appService.client.logout();

    return {
      totalMessages: mailboxStatus.messages,
      totalUnread: unreadmailboxStatus
    };
  }
 
  async searchMessagesByEmail(email: string): Promise<any> {
    // Select the mailbox to search in
    await this.appService.client.mailboxOpen('INBOX');
  
    // Search for messages from the specified email address
    const uids = await this.appService.client.search({ from: email });

    // Fetch the contents of each message
    const fetchedMessages = [];
    for await (const message of this.appService.client.fetch(uids, { envelope: true, source: true  })) {
      fetchedMessages.push({ 
        uid: message.uid, 
       headers: message.envelope,
       body: message.source.toString(),
       });
    }
  
    // Disconnect from the IMAP server
    await this.appService.client.logout();
  
    return fetchedMessages
  }
  
  async getUnreadMessages(page: number , limit: number ): Promise<any> {
    await this.appService.client.mailboxOpen('INBOX');
  
    // Search for unread messages
    const uids = await this.appService.client.search({unseen:true});
    
    // Fetch the contents of each unread message
    const fetchedMessages = [];
    for await (const message of this.appService.client.fetch(uids, { envelope: true, bodyParts: true, unseen:true})) {
      fetchedMessages.push({
        
        unreadmessage: message.envelope
      });
    }
    const unreadmailboxStatus =  await this.appService.client.status('INBOX',{unseen: true});
    // Disconnect from the IMAP server
    await this.appService.client.logout();
  

  
    return {
      unreadMessages: fetchedMessages,
      totalUnread: unreadmailboxStatus,
      page,
      limit
    };
  }

}
