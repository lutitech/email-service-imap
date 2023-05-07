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
    // Open the INBOX mailbox
    await this.appService.client.mailboxOpen('INBOX');
  
    // Get the mailbox status
    const mailboxStatus = await this.appService.client.status('INBOX', { messages: true });
  
    // Calculate the start and end sequence numbers based on page and limit
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, mailboxStatus.messages);
  
    // Fetch messages from the IMAP server
    const messages = [];
    for await (const message of this.appService.client.fetch(`${start}:${end}`, { envelope: true , source: true,  unseen: true, threadId: true})) {
      messages.push({ 
        uid: message.uid,
        headers: message.envelope,
        threadId: message.threadId,
        body: message.source.toString(),
      });
    }
  
    // Return the messages array and other information
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
    const totalEmails = await this.appService.client.status('INBOX', { messages: true });
    const unreadmailboxStatus =  await this.appService.client.status('INBOX',{unseen: true});

      // Disconnect from the IMAP server
    await this.appService.client.logout();

    return {
      totalMessages: totalEmails.messages,
      totalUnread: unreadmailboxStatus
    };
  }
 
  async searchMailByEmail(email: string): Promise<any> {
    // Select the mailbox to search in
    await this.appService.client.mailboxOpen('INBOX');
  
    // Search for messages from the specified email address
    const uids = await this.appService.client.search({ from: email });
    
    // Fetch the contents of each message
    const fetchedMessages = [];
    for await (const message of this.appService.client.fetch(uids, { envelope: true, source: true })) {
        fetchedMessages.push({ 
            uid: message.uid, 
            headers: message.envelope,
            body: message.source.toString(),
        });
    }

    return fetchedMessages;
}

  

async getUnreadMessages(page: number , limit: number ): Promise<any> {
  // Open the INBOX mailbox
  await this.appService.client.mailboxOpen('INBOX');

  // Search for unread messages
  const uids = await this.appService.client.search({unseen:true});

  // Calculate the start and end indexes based on page and limit
  const start = (page - 1) * limit;
  const end = Math.min(page * limit, uids.length);

  // Slice the uids array to get only the uids for the current page
  const pageUids = uids.slice(start, end);

  // Fetch the contents of each unread message in the current page
  const fetchedMessages = [];
  for await (const message of this.appService.client.fetch(pageUids, { envelope: true, source: true, bodyParts: true, unseen:true})) {
    fetchedMessages.push({
      
      unreadmessage: message.envelope,
      body: message.source
    });
  }

  // Get the mailbox status for unread messages
  const unreadmailboxStatus =  await this.appService.client.status('INBOX',{unseen: true});

  // Disconnect from the IMAP server
  await this.appService.client.logout();

  // Return the fetched messages array and other information
  return {
    unreadMessages: fetchedMessages,
    totalUnread: unreadmailboxStatus,
    page,
    limit
  };
}


}
