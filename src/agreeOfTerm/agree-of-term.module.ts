import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreeOfTerm } from '@root/agreeOfTerm/entities/agree-of-term.entity';
import { AgreeOfTermController } from '@root/agreeOfTerm/agree-of-term.controller';
import { AgreeOfTermService } from '@root/agreeOfTerm/agree-of-term.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgreeOfTerm])],
  controllers: [AgreeOfTermController],
  providers: [AgreeOfTermService],
})
export class AgreeOfTermModule {}
