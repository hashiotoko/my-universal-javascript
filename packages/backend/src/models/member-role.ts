import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MemberRoleAttrs = Pick<MemberRole, 'name'>;
export type MemberRoleName = keyof typeof MemberRole.NAMES;

@Entity('member_roles')
export class MemberRole {
  static readonly NAMES = {
    admin: 'admin',
    stuff: 'stuff',
  } as const;

  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ name: 'name' })
  name!: MemberRoleName;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt!: Date;

  constructor(attrs?: MemberRoleAttrs) {
    if (!attrs) return this;

    this.name = attrs.name;
  }

  public isAdmin(): boolean {
    return this.name === MemberRole.NAMES.admin;
  }

  public isStuff(): boolean {
    return this.name === MemberRole.NAMES.stuff;
  }
}