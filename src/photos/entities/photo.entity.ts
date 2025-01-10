import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Destination } from '../../destinations/entities/destination.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Destination, (destination) => destination.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'destination_id',
    referencedColumnName: 'id',
  })
  destination: Destination;

  @OneToOne(() => User, (user) => user.photo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
