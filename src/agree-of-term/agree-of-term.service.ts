import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAgreeOfTermDto } from '@root/agree-of-term/dto/create-agree-of-term.dto';
import { User } from '@user/entities/user.entity';
import { UpdateAgreeOfTermDto } from '@root/agree-of-term/dto/update-agree-of-term.dto';

@Injectable()
export class AgreeOfTermService {
  constructor(
    @InjectRepository(AgreeOfTerm)
    private repository: Repository<AgreeOfTerm>,
  ) {}

  // 생성 로직
  async createAgreeOfTerm(user: User, dto: CreateAgreeOfTermDto) {
    const agreeOfTerm = this.repository.create({
      user,
      ...dto,
    });
    await this.repository.save(agreeOfTerm);

    return agreeOfTerm;
  }

  // 수정 로직
  async updateAgreeOfTerm(user: User, dto: UpdateAgreeOfTermDto) {
    const result: UpdateResult = await this.repository.update(
      {
        id: user.agreeOfTerm.id,
      },
      dto,
    );

    if (result.affected) return 'updated';
    throw new BadRequestException('error');
  }
}
