import { EntityBaseRaw } from 'shared/infra/database';
import { Entity, Column, Index, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('user')
@Index('email', { unique: true })
export class UserRaw extends EntityBaseRaw {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    length: 255,
    nullable: false,
  })
  isDeleted: boolean;

  @Column({
    name: 'is_email_verified',
    type: 'boolean',
    length: 255,
    nullable: false,
  })
  isEmailVerified: boolean;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    nullable: true,
  })
  lastLogin: Date;
}
