import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Provider } from '@user/entities/provider.enum';
import { CreateAgreeOfTermDto } from '@root/agreeOfTerm/dto/create-agree-of-term.dto';
import { AgreeOfTerm } from '@root/agreeOfTerm/entities/agree-of-term.entity';

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
  @MinLength(7)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/) //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
  @ApiProperty({ example: '123456a!' })
  password?: string;

  @IsNumber()
  @ApiProperty({ example: 1012345678 })
  phone?: number;

  @IsString()
  provider?: Provider;

  @IsString()
  profileImg?: string;

  @ApiProperty({ type: CreateAgreeOfTermDto })
  agreeOfTerm?: AgreeOfTerm;
}
