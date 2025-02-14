import { Test } from '@nestjs/testing';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { ListTestimonialDto } from './dto/list-testimonial.dto';
import { Photo } from '../photos/entities/photo.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Testimonial } from './entities/testimonial.entity';
import { UserRequest } from '../auth/auth.guard';
import { UserPayload } from '../auth/auth.service';

describe('TestimonialsController', () => {
  let testimonialsService: TestimonialsService;
  let controller: TestimonialsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestimonialsController],
      providers: [
        {
          provide: TestimonialsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getRandomTestimonials: jest.fn(),
          },
        },
      ],
    }).compile();

    testimonialsService = moduleRef.get<TestimonialsService>(TestimonialsService);
    controller = moduleRef.get<TestimonialsController>(TestimonialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('testimonialsService should be defined', () => {
    expect(testimonialsService).toBeDefined();
  });

  describe('create', () => {
    it('should return an object of testimonial', async () => {
      const userId = '1';
      const req = { user: { sub: userId } } as UserRequest;
      const createTestimonialDto: CreateTestimonialDto = { testimonial: 'Text' };
      const testimonialSaved = { id: '1', userId, testimonial: 'Text' };
      const result = new ListTestimonialDto(testimonialSaved.id, testimonialSaved.userId, testimonialSaved.testimonial);

      jest.spyOn(testimonialsService, 'create').mockResolvedValueOnce(testimonialSaved);

      expect(await controller.create(createTestimonialDto, req)).toStrictEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of testimonials', async () => {
      const testimonialSaved: Testimonial[] = [
        {
          id: 'abcd',
          testimonial: 'Text',
          user: [] as never,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          deletedAt: '2024-01-01',
        },
      ];
      jest.spyOn(testimonialsService, 'findAll').mockResolvedValue(testimonialSaved);

      expect(await controller.findAll()).toStrictEqual(testimonialSaved);
    });
  });

  describe('findOne', () => {
    it('should return an object of testimonial', async () => {
      const id = '1';
      const testimonial = {
        id: '1',
        name: 'Foo',
        photo: new Photo(),
        testimonial: 'bla bla bla',
        user: [] as never,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        deletedAt: '2024-01-01',
      };
      jest.spyOn(testimonialsService, 'findOne').mockResolvedValue(testimonial);

      const result = await controller.findOne(id);

      expect(result).toEqual(testimonial);
    });
  });

  describe('update', () => {
    it('should return a message with the updated id', async () => {
      const id = '1';
      const req = { user: { sub: '1' } } as UserRequest;
      const dataToUpdate: UpdateTestimonialDto = { testimonial: 'Text updated' };
      const result = { message: `Testimonial #${id} was updated` };
      jest.spyOn(testimonialsService, 'update').mockResolvedValueOnce(undefined);

      expect(await controller.update(id, dataToUpdate, req)).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should return a message with the deleted id', async () => {
      const id = '1';
      const expected = { message: `Testimonial #${id} was deleted` };
      jest.spyOn(testimonialsService, 'remove').mockResolvedValueOnce();

      const result = await controller.remove(id);

      expect(result).toEqual(expected);
    });
  });

  describe('randomTestimonials', () => {
    it('should return 3 random testimonials', async () => {
      const result = Array(3);

      jest.spyOn(testimonialsService, 'getRandomTestimonials').mockResolvedValue(Array(3));

      const response = await controller.pick();

      expect(response).toEqual(result);
      expect(response).toHaveLength(3);
    });
  });
});
