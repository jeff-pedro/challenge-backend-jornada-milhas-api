import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Photo } from '../../photos/entities/photo.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { DestinationDescription } from './destination-description.entity';

@Entity({ name: 'destinations' })
export class Destination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Column({ name: 'target', length: 160, nullable: false })
  target: string;
  
  @Column({ name: 'price', nullable: true, default: 0 })
  price: number;

  @ApiHideProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: string;

  @ApiHideProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: string;

  @ApiHideProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: string;

  @OneToMany(() => Photo, (photo) => photo.destination, {
    cascade: true,
  })
  photos: Photo[];

  @OneToOne(() => DestinationDescription, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  description: DestinationDescription;  
}
