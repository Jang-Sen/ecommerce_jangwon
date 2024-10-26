import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreeOfTermDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  overFourteen: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  agreeOfTerm: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  agreeOfPersonalInfo: boolean;

  @IsBoolean()
  @ApiProperty({ example: true })
  agreeOfMarketing?: boolean;

  @IsBoolean()
  @ApiProperty({ example: true })
  agreeOfEvent?: boolean;
}
