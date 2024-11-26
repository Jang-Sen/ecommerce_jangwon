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

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
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
  @ApiOperation({
    summary: 'Id로 회원 조회 API',
    description: `${Role.ADMIN}만 이용가능`,
  })
  async findByUserId(@Param() { id }: ObjectWithIdDto) {
    return await this.userService.getUserBy('id', id);
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
        img: {
          type: 'string',
          format: 'binary',
          description: 'profileImg',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateUserImg(
    @Req() req: RequestWithUserInterface,
    @Body() updateUserDto?: CreateUserDto,
    @UploadedFile() img?: BufferedFile,
  ): Promise<any> {
    return await this.userService.updateUserInfoByToken(
      req.user,
      img,
      updateUserDto,
    );
  }
}
