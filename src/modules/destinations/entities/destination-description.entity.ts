import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'destinations_description' })
export class DestinationDescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'text', nullable: true })
  text: string;

  @Column({ name: 'title', length: 100, nullable: true })
  title: string;

  @Column({ name: 'subtitle', length: 100, nullable: true })
  subtitle: string;
}
