import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '@user/user.service';
import { RoleGuard } from '@auth/guards/role.guard';
import { Role } from '@user/entities/role.enum';
import { ObjectWithIdDto } from '@root/common/objectWithId.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(RoleGuard(Role.ADMIN))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async findAll() {
    return await this.userService.getUserByAll();
  }

  @Get('/:id')
  async findByUserId(@Param() { id }: ObjectWithIdDto) {
    return await this.userService.getUserBy('id', id);
  }
}
