import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Photo } from '../../photos/entities/photo.entity';

@Entity({ name: 'destinations' })
export class Destination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Column({ name: 'target', length: 160, nullable: false })
  target: string;

  @Column({ name: 'descriptive_text', nullable: false })
  descriptiveText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: string;

  @OneToMany(() => Photo, (photo) => photo.destination, {
    cascade: true,
  })
  photos: Photo[];
}
