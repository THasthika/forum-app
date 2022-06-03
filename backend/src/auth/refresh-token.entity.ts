import { UserEntity } from '../users/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, { primary: true })
  user: UserEntity;

  @Column({ primary: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expiry: Date;
}
