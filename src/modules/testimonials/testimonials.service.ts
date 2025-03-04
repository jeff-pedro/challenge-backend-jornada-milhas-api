import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Testimonial } from './entities/testimonial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { User } from '../users/entities/user.entity';
import { Photo } from '../photos/entities/photo.entity';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private testimonialRepository: Repository<Testimonial>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    { testimonial }: CreateTestimonialDto,
    userId: string
  ): Promise<{ id: string; userId: string; testimonial: string }> {
    const user = await this.findUserById(userId);

    const testimonialSaved = await this.testimonialRepository.save({
      testimonial,
      user,
    });

    return {
      id: testimonialSaved.id,
      userId: testimonialSaved.user.id,
      testimonial: testimonialSaved.testimonial,
    };
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(options?: object): Promise<Testimonial[]> {
    const testimonialSaved = await this.testimonialRepository.find({
      ...options,
      relations: ['user'],
      select: { user: { id: true }}
    });

    if (testimonialSaved.length === 0) {
      throw new NotFoundException('Any testimonial was found');
    }

    return testimonialSaved;
  }

  async findOne(
    id: string,
  ): Promise<{ id: string; userId: string; testimonial: string }> {
    const testimonialSaved = await this.testimonialRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });

    if (!testimonialSaved) {
      throw new NotFoundException('Testimonial not found');
    }

    return {
      id: testimonialSaved.id,
      userId: testimonialSaved.user.id,
      testimonial: testimonialSaved.testimonial,
    };
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
    userId: string
  ): Promise<void> {
    const testimonialSaved = await this.testimonialRepository.findOne({
      where: { id },
      relations: ['user'],
      select: { user: { id: true } }
    });

    if (testimonialSaved === null) {
      throw new NotFoundException('Testimonial not found');
    }

    if (testimonialSaved?.user.id !== userId) {
      throw new ForbiddenException(`There is no testimonial for id#${userId}`);
    }

    await this.testimonialRepository.update(
      { id, user: { id: userId }},
      updateTestimonialDto,
    );
  }

  async remove(id: string): Promise<void> {
    const testimonialToDelete = await this.testimonialRepository.delete(id);

    if (testimonialToDelete.affected === 0) {
      throw new NotFoundException('Testimonial not found');
    }
  }

  async getRandomTestimonials(): Promise<Testimonial[]> {
    return await this.testimonialRepository.find({
      order: { id: 'ASC' },
      take: 3,
    });
  }
}
