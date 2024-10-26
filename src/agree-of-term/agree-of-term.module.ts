import { Module } from '@nestjs/common';
import { AgreeOfTermService } from './agree-of-term.service';
import { AgreeOfTermController } from './agree-of-term.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgreeOfTerm])],
  controllers: [AgreeOfTermController],
  providers: [AgreeOfTermService],
})
export class AgreeOfTermModule {}
