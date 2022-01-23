import { ID, Role, User, VendureEntity } from "@vendure/core";
import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export type PostOperation = "create" | "update" | "delete" | "read" | "list";

export type PostPermissionScope = "author" | "all" | "contributor";

@Entity()
@Index(['customType', 'role', 'operation', 'scope'])
export class PostPermission extends VendureEntity {
  @PrimaryGeneratedColumn()
  id!: ID;

  @Column('varchar')
  operation!: PostOperation;

  @ManyToOne(() => Role)
  @JoinColumn()
  role!: Role;

  @Column()
  shouldAllow!: boolean;

  @Column('varchar')
  scope!: PostPermissionScope;

  @Column()
  customType!: string;

  constructor(input: DeepPartial<PostPermission>) {
    super(input);
  }
}
