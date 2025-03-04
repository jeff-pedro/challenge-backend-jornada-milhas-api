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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'photos' })
export class Photo {
  @ApiProperty({ default: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiHideProperty()
  @ManyToOne(() => Destination, (destination) => destination.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'destination_id',
    referencedColumnName: 'id',
  })
  destination: Destination;

  @ApiHideProperty()
  @OneToOne(() => User, (user) => user.photo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
