import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';


@Injectable()
export class AppService {
  public client: ImapFlow;

  async connect(): Promise<void> {
    this.client = new ImapFlow({
      host: 'mail.forbessolarsystems.com',
      port: 993,
      secure: true,
       auth: {
        user: 'lutor.ayangaor@forbessolarsystems.com',
        pass: 'Luti@4148#',
      },
    });
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.logout();
  }
}
