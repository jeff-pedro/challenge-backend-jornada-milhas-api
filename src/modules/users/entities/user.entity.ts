import { Exclude } from 'class-transformer';
import { Photo } from '../../photos/entities/photo.entity';
import { Testimonial } from '../../testimonials/entities/testimonial.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 100, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', length: 255, nullable: false })
  lastName: string;

  @Column({ name: 'email', length: 70, nullable: false })
  email: string;

  @Exclude()
  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @OneToMany(() => Testimonial, (testimonial) => testimonial.user)
  testimonials: Testimonial[];

  @OneToOne(() => Photo, (photo) => photo.user, {
    cascade: true,
  })
  photo: Photo;
}
