import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { query } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '用户注册',
    description: '注册一个用户',
    tags: ['user'],
  })
  @Post('/regist')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.add(createUserDto);
  }

  @ApiOperation({
    summary: '用户登录',
    description: '用户登录，返回token',
    tags: ['user'],
  })
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({
    summary: '获取用户信息',
    description: '获取用户信息， 返回用户详细信息',
    tags: ['user'],
  })
  @Get('/info')
  @UseGuards(AuthGuard)
  async getUser(@Query('userid') id: number) {
    return this.userService.getUserInfo(id);
  }

  // @Get('/query/:id')
  // getUserById(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.findOne(id);
  // }

  // @Get('/all')
  // getAllUsers() {
  //   return this.userService.findAll();
  // }
}
