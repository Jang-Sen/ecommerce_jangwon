import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Provider } from '@user/entities/provider.enum';
import { CreateAgreeOfTermDto } from '@root/agreeOfTerm/dto/create-agree-of-term.dto';
import { AgreeOfTerm } from '@root/agreeOfTerm/entities/agree-of-term.entity';
import { Profile } from '@profile/entities/profile.entity';
import { CreateProfileDto } from '@profile/dto/create-profile.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: '오장원' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'dh789521@gmail.com' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(7)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/) //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
  @ApiPropertyOptional({ example: '123456a!' })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '01095110662' })
  phone?: string;

  @IsString()
  @IsOptional()
  provider?: Provider;

  @IsString()
  @IsOptional()
  profileImg?: string;

  @IsOptional()
  @ApiProperty({ type: CreateAgreeOfTermDto })
  agreeOfTerm?: AgreeOfTerm;

  @IsOptional()
  @ApiPropertyOptional({ type: CreateProfileDto })
  profile?: Profile;
}
