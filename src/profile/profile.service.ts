import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { Profile } from '@profile/entities/profile.entity';
import { CreateProfileDto } from '@profile/dto/create-profile.dto';
import { UpdateProfileDto } from '@profile/dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
  ) {}

  // 프로필 생성 로직
  async createProfile(user: User, dto: CreateProfileDto) {
    const profile = this.repository.create({
      user,
      ...dto,
    });

    await this.repository.save(profile);

    return profile;
  }

  // 프로필 수정 로직
  async updateProfile(user: User, dto: UpdateProfileDto) {
    const result = await this.repository.update(
      {
        id: user.profile.id,
      },
      dto,
    );

    if (!result.affected) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }

    return 'Update Profile';
  }
}
