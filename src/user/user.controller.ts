import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { Role } from '@user/entities/role.enum';
import { ObjectWithIdDto } from '@root/common/dto/objectWithId.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { User } from '@user/entities/user.entity';
import { PageOptionsDto } from '@root/common/dto/page-options.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@auth/guards/accessToken.guard';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { BufferedFile } from '@minio-client/interface/file.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from '@auth/guards/role.guard';
import { UpdateUserDto } from '@user/dto/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: '전체 조회 API',
    description: `${Role.ADMIN}만 이용가능`,
  })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.getUserByAll(pageOptionsDto);
  }

  @Get('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: 'Id로 회원 조회 API',
    description: `${Role.ADMIN}만 이용가능`,
  })
  async findByUserId(@Param() { id }: ObjectWithIdDto) {
    return await this.userService.getUserBy('id', id);
  }

  @Get('/check/:email')
  @ApiOperation({ summary: 'Email로 회원 조회' })
  async findByUserEmail(@Param('email') email: string) {
    return await this.userService.getUserBy('email', email);
  }

  @Put()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('img'))
  @ApiBody({ type: CreateUserDto })
  @ApiBody({
    description: 'test',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'username',
          example: '오장원',
        },
        img: {
          type: 'string',
          format: 'binary',
          description: 'profileImg',
        },
        'profile.birth': {
          type: 'string',
          description: '생년월일',
          example: '1998-05-08',
        },
        'profile.gender': {
          type: 'string',
          description: '성별',
          example: 'MALE',
        },
        'profile.introduce': {
          type: 'string',
          description: '한 줄 소개',
          example: '안녕하세요. 오장원입니다.',
        },
        'profile.snsLink': {
          type: 'string',
          description: 'SNS 링크',
          example: 'https://www.naver.com',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '회원 프로필 변경',
  })
  async updateUserImg(
    @Req() req: RequestWithUserInterface,
    @Body() updateUserDto?: UpdateUserDto,
    @UploadedFile() img?: BufferedFile,
  ): Promise<User> {
    return await this.userService.updateUserInfoByToken(
      req.user,
      img,
      updateUserDto,
    );
  }
}
