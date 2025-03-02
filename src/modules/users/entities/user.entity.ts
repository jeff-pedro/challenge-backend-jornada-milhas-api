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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ name: 'first_name', length: 100, nullable: false })
  firstName: string;

  @ApiProperty()
  @Column({ name: 'last_name', length: 255, nullable: false })
  lastName: string;

  @ApiProperty()
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

  @ApiProperty({ type: () => Photo })
  @OneToOne(() => Photo, (photo) => photo.user, {
    cascade: true,
  })
  photo: Photo;
}
