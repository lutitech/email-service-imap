import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LabelsService } from './labels/labels.service';
import { DeleteService } from './delete/delete.service';
import { SearchService } from './search/search.service';
import { MarkService } from './mark/mark.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LabelsService, DeleteService, SearchService, MarkService],
})
export class AppModule {}
