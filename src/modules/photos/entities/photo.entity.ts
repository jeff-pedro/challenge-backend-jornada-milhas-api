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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
