import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { RoleGuard } from '@auth/guards/role.guard';
import { Role } from '@user/entities/role.enum';
import { ObjectWithIdDto } from '@root/common/dto/objectWithId.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { User } from '@user/entities/user.entity';
import { PageOptionsDto } from '@root/common/dto/page-options.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@UseGuards(RoleGuard(Role.ADMIN))
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
}
