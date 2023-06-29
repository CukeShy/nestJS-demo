import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_auths')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  user_salt: string;

  @Column()
  user_hash: string;
}
