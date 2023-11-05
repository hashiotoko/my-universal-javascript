import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMemberMemberRole1697634175918 implements MigrationInterface {
  private tableName: string = 'members_member_roles';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'member_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'member_role_id',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['member_id'],
            referencedTableName: 'members',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['member_role_id'],
            referencedTableName: 'member_roles',
            referencedColumnNames: ['id'],
          },
        ],
        indices: [
          {
            columnNames: ['member_id'],
          },
          {
            columnNames: ['member_role_id'],
          },
        ],
      }),
    );
    // ==auto generate query==
    // await queryRunner.query(`
    //   CREATE TABLE "members_member_roles" (
    //     "member_id" integer NOT NULL,
    //     "member_role_id" integer NOT NULL,
    //     CONSTRAINT "PK_7b9599a2355b8dcf92cb8317ff1" PRIMARY KEY ("member_id", "member_role_id")
    //   )
    // `);
    // await queryRunner.query(`
    //   CREATE INDEX "IDX_611ed3dfb93d527a0ea0f4acb8" ON "members_member_roles" ("member_id")
    // `);
    // await queryRunner.query(`
    //   CREATE INDEX "IDX_195039e9c4cd0947cb4f18dad2" ON "members_member_roles" ("member_role_id")
    // `);
    // await queryRunner.query(`
    //   ALTER TABLE "members_member_roles"
    //   ADD CONSTRAINT "FK_611ed3dfb93d527a0ea0f4acb85" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    // `);
    // await queryRunner.query(`
    //   ALTER TABLE "members_member_roles"
    //   ADD CONSTRAINT "FK_195039e9c4cd0947cb4f18dad2e" FOREIGN KEY ("member_role_id") REFERENCES "member_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
