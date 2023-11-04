import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Member } from './member';

export type TeamAttrs = Pick<
  Team,
  'name' | 'postalCode' | 'mailAddress' | 'firstLoggedInAt'
>;

@Entity('teams')
export class Team {
  static readonly MAX_NAME_LENGTH: number = 50;
  static readonly POSTAL_CODE_LENGTH: number = 7;

  @PrimaryGeneratedColumn('increment')
  readonly id!: number;

  @Column({ name: 'name', length: Team.MAX_NAME_LENGTH })
  name!: string;

  @Column({ name: 'postal_code', length: Team.POSTAL_CODE_LENGTH })
  postalCode!: string;

  @Column({ name: 'mail_address' })
  mailAddress!: string;

  @OneToMany(() => Member, (member) => member.team, { onDelete: 'CASCADE' })
  members?: Relation<Member>[];

  @Column({ name: 'first_logged_in_at', nullable: true, type: 'timestamptz' })
  firstLoggedInAt?: Date | null;

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

  constructor(attrs?: TeamAttrs) {
    if (!attrs) return this;

    this.name = attrs.name;
    this.postalCode = attrs.postalCode;
    this.mailAddress = attrs.mailAddress;
    if (attrs.firstLoggedInAt) {
      this.firstLoggedInAt = attrs.firstLoggedInAt;
    }
  }
}
