import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Team } from './team';
import { MemberRole } from './member-role';

export type MemberAttrs = Pick<Member, 'teamId' | 'team' | 'name' | 'roles'>;

@Entity('members')
export class Member {
  static readonly MAX_NAME_LENGTH: number = 50;

  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ name: 'team_id' })
  readonly teamId?: number;

  @ManyToOne(() => Team, {
    orphanedRowAction: 'soft-delete',
    eager: true,
  })
  @JoinColumn({ name: 'team_id' })
  readonly team?: Relation<Team>;

  @Column({ name: 'name', length: Member.MAX_NAME_LENGTH })
  name!: string;

  @ManyToMany(() => MemberRole, (memberRole) => memberRole.members, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'members_member_roles', // 中間テーブル名
    // 定義元
    joinColumn: {
      name: 'member_id', // 中間テーブルのカラム名
      referencedColumnName: 'id', // 参照カラム名
    },
    // 定義先
    inverseJoinColumn: {
      name: 'member_role_id', //
      referencedColumnName: 'id',
    },
  })
  roles?: Relation<MemberRole>[];

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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  readonly deletedAt?: Date;

  constructor(attrs?: MemberAttrs) {
    if (!attrs) return this;

    if (attrs.teamId) {
      this.teamId = attrs.teamId;
    } else {
      this.team = attrs.team;
    }
    this.name = attrs.name;
    if (attrs.roles) this.roles = attrs.roles;
  }
}
