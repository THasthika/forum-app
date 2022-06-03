import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @Column()
  userId: string;

  @ManyToOne(() => User, { primary: true })
  user: User;

  @Column({ primary: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expiry: Date;
}
