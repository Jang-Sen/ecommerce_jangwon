import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from '@profile/profile.controller';
import { ProfileService } from '@profile/profile.service';
import { Profile } from '@profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
