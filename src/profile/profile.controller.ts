import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@auth/guards/accessToken.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { ProfileService } from '@profile/profile.service';
import { CreateProfileDto } from '@profile/dto/create-profile.dto';
import { UpdateProfileDto } from '@profile/dto/update-profile.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 프로필 등록
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '프로필 등록', description: '프로필 등록 API' })
  async createProfile(
    @Req() req: RequestWithUserInterface,
    @Body() dto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(req.user, dto);
  }

  @Put()
  @UseGuards(AccessTokenGuard)
  @ApiBody({ type: CreateProfileDto })
  @ApiOperation({ summary: '프로필 수정', description: '프로필 수정 API' })
  async updateProfile(
    @Req() req: RequestWithUserInterface,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(req.user, dto);
  }
}
