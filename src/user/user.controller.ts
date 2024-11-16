import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '@user/user.service';
import { RoleGuard } from '@auth/guards/role.guard';
import { Role } from '@user/entities/role.enum';
import { ObjectWithIdDto } from '@root/common/objectWithId.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { User } from '@user/entities/user.entity';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(RoleGuard(Role.ADMIN))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.getUserByAll(pageOptionsDto);
  }

  @Get('/:id')
  async findByUserId(@Param() { id }: ObjectWithIdDto) {
    return await this.userService.getUserBy('id', id);
  }
}
