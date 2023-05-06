import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class MarkService {
    constructor ( private readonly appService: AppService){}

    async markEmailSeen(uid: number): Promise<any> {
        await this.appService.client.mailboxOpen('INBOX');
      const message = await this.appService.client.fetchOne(uid, { uid: true, flags: true });
      console.log(message);
      if (!Array.isArray(message.flags) || !message.flags.includes('\\unSeen')) {
        await this.appService.client.logout();
        return { result: 'Message is already unseen' };
      }
      const result = await this.appService.client.messageFlagsRemove(uid, { seen: true }, ['\\Seen']);
      await this.appService.client.logout();
    
      return {
        result: result,
      };
    }
      
      
    // mark all seen messages as unseen 
    async markEmailUnseen(uid: number): Promise<any> {
      await this.appService.client.mailboxOpen('INBOX');
      const message = await this.appService.client.fetchOne(uid, { uid: true, flags: true });
      console.log(message);
      if (!Array.isArray(message.flags) || !message.flags.includes('\\Seen')) {
        await this.appService.client.logout();
        return { result: 'Message is already unseen' };
      }
      const result = await this.appService.client.messageFlagsRemove(uid, { seen: true }, ['\\Seen']);
      await this.appService.client.logout();
    
      return {
        result: result,
      };
    }
}
