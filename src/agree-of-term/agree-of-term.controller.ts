import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AgreeOfTermService } from './agree-of-term.service';
import { CreateAgreeOfTermDto } from '@root/agree-of-term/dto/create-agree-of-term.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@auth/guards/accessToken.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { UpdateAgreeOfTermDto } from '@root/agree-of-term/dto/update-agree-of-term.dto';

@ApiTags('terms')
@Controller('terms')
export class AgreeOfTermController {
  constructor(private readonly agreeOfTermService: AgreeOfTermService) {}

  // 생성 API
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '이용약관 생성 API' })
  @ApiBody({ type: CreateAgreeOfTermDto })
  async createAgreeOfTerm(
    @Req() req: RequestWithUserInterface,
    @Body() dto: CreateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermService.createAgreeOfTerm(req.user, dto);
  }

  @Put()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '이용약관 수정 API' })
  @ApiBody({ type: CreateAgreeOfTermDto })
  async updateAgreeOfTerm(
    @Req() req: RequestWithUserInterface,
    @Body() dto: UpdateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermService.updateAgreeOfTerm(req.user, dto);
  }
}
