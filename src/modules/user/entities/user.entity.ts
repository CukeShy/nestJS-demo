import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  mobile: string;

  @Column()
  avatar_url: string;

  @Column({ default: false })
  is_vip: boolean;

  @Column({ default: false })
  is_designer: boolean;

  @Column()
  weChat_openid: string;

  @Column()
  wechat_image: string;

  @Column()
  wechat_nickname: string;
}
