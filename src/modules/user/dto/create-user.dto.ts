import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '电话',
    required: true,
  })
  @IsString()
  mobile: string;

  @ApiProperty({
    description: '密码',
    required: true,
  })
  @IsString()
  passwd: string;
}
