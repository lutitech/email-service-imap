import { Controller, Get, Param, Query, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { LabelsService } from './labels/labels.service';
import { MarkService } from './mark/mark.service';
import { SearchService } from './search/search.service';
import { DeleteService} from './delete/delete.service';

@Controller('email')
export class AppController {
  constructor(
    private readonly imapService: AppService,
    private readonly labelsService: LabelsService,
    private readonly markService: MarkService,
    private readonly searchService: SearchService,
    private readonly deleteService: DeleteService
    ) {}

  @Get('getEmail/:uid')
  async getMessageById(@Param('uid') uid: number): Promise<string> {
    await this.imapService.connect();
    const messageSource = await this.searchService.getMessageById(uid);
    await this.imapService.disconnect();
    return messageSource;
  }

  @Get('getAllEmails')
  async getAllMessages(@Query('page') page: number = 1, @Query('size') limit: number = 10): Promise<any> {
    await this.imapService.connect();
    const messageSubjects = await this.searchService.getAllMessage(page,limit);
    await this.imapService.disconnect();
    return messageSubjects;
  }

  @Get('getAllTotalEmails')
  async getTotalMessages(): Promise<number> {
    await this.imapService.connect();
    const totalMessages = await this.searchService.getTotalMessages();
    await this.imapService.disconnect();
    return totalMessages;
  }

  @Get('getUnreadEmails')
  async getUnreadMessages(@Query('page') page: number = 1, @Query('size') limit: number = 10): Promise<number> {
    await this.imapService.connect();
    const totalMessages = await this.searchService.getUnreadMessages(page, limit);
    await this.imapService.disconnect();
    return totalMessages;
  }

  @Get('markAsSeen/:uid')
  async markEmailSeen(@Param('uid') uid: number): Promise<number> {
    await this.imapService.connect();
    const seenMessages = await this.markService.markEmailSeen(uid);
    await this.imapService.disconnect();
    return seenMessages;
  }

  @Get('markAsUnseen/:uid')
  async markEmailUnseen(@Param('uid') uid: number): Promise<number> {
    await this.imapService.connect();
    const unseenMessages = await this.markService.markEmailUnseen(uid);
    await this.imapService.disconnect();
    return unseenMessages;
  }

  @Get('/searchByMail/:email')
  
  async searchMessagesByEmail(@Param('email') email: string): Promise<any> {
    await this.imapService.connect()
    const messages = await this.searchService.searchMailByEmail(email);
    return messages;
  }

  @Get('/searchBylabel/:label')
  async getMessagesByLabel(@Query('label') label: string): Promise<any> {
    await this.imapService.connect()
    const messages = await this.labelsService.searchMailsByLabel(label);
    return messages;
  }

  @Get('set-label/:uid/:label')
  async setLabel(@Param('uid') uid: number, label: string): Promise<void> {
    await this.imapService.connect()
    const setlabel = await this.labelsService.setLabel(uid, label);
    return setlabel
  }

  @Delete('delete/:uid')
  
  async deleteEmail(@Param('uid') uid: number): Promise<void> {
    await this.imapService.connect()
    await this.deleteService.deleteEmail(uid);
  }
}



