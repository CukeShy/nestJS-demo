import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth } from './entities/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomString } from 'src/utils/random';
import { createHash } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  // 用户注册
  async add(user: CreateUserDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    // 开启事务
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let userInfo;

    try {
      userInfo = await this.userRepository.save(user, { transaction: false });
      const salt = randomString(12);
      const sha1 = createHash('sha1').update(user.passwd).digest('hex');
      const user_hash = createHash('md5')
        .update(sha1 + salt)
        .digest('hex');
      const auth = {
        user_id: userInfo.id,
        user_salt: salt,
        user_hash,
      };
      await this.authRepository.save(auth, { transaction: false });

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      return { success: false, message: '注册失败' };
    } finally {
      await queryRunner.release();
    }
    delete userInfo.passwd;
    return { success: true, message: '注册成功', data: userInfo };
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, passwd } = loginUserDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let user;
    try {
      user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) {
        return { success: false, message: '用户名或密码错误' };
      }
      const auth = await this.authRepository.findOne({
        where: { user_id: user.id },
      });
      if (!auth) {
        return { success: false, message: '用户名或密码错误' };
      }
      const sha1 = createHash('sha1').update(passwd).digest('hex');
      const hash = createHash('md5')
        .update(sha1 + auth.user_salt)
        .digest('hex');
      if (hash !== auth.user_hash) {
        return { success: false, message: '用户名或密码错误' };
      } else {
        const payload = { username, sub: user.id };
        const token = this.jwtService.sign(payload);
        return { success: true, message: '登陆成功', data: { token } };
      }
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      return { success: false, message: '用户名或密码错误' };
    } finally {
      await queryRunner.release();
    }
  }

  async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (user) {
      return { success: true, message: '获取用户信息成功', data: user };
    } else {
      return { success: false, message: '未查询到该用户信息' };
    }
  }

  // findAll(): Promise<User[]> {
  //   return this.usersRepository.find();
  // }

  // async findOne(id: number): Promise<User[]> {
  //   const users = await this.usersRepository.find({
  //     where: { id: id },
  //   });
  //   return users;
  // }

  // async getBySql() {
  //   return await this.usersRepository.query('select * from users');
  // }

  // async remove(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
