import { Test } from '@nestjs/testing';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { ListTestimonialDto } from './dto/list-testimonial.dto';
import { Photo } from '../photos/entities/photo.entity';

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

    testimonialsService =
      moduleRef.get<TestimonialsService>(TestimonialsService);
    controller = moduleRef.get<TestimonialsController>(TestimonialsController);
    testimonialsService =
      moduleRef.get<TestimonialsService>(TestimonialsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('testimonialsService should be defined', () => {
    expect(testimonialsService).toBeDefined();
  });

  describe('create', () => {
    it('should return an object of testimonial', async () => {
      const testimonialDto = {
        userId: '1',
        testimonial: 'Text',
      };
      const testimonialSaved = {
        id: '1',
        ...testimonialDto,
      };
      const result = new ListTestimonialDto(
          testimonialSaved.id,
          testimonialSaved.userId,
          testimonialSaved.testimonial,
        );
      jest
        .spyOn(testimonialsService, 'create')
        .mockResolvedValueOnce(testimonialSaved);

      expect(await controller.create(testimonialDto)).toStrictEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of testimonials', async () => {
      const testimonialSaved = [
        {
          id: 'abcd',
          testimonial: 'Text',
          user: [] as never,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          deletedAt: '2024-01-01',
        },
      ];
      const result = testimonialSaved;
      jest
        .spyOn(testimonialsService, 'findAll')
        .mockResolvedValue(testimonialSaved);

      expect(await controller.findAll()).toStrictEqual(result);
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
      const expected = testimonial;
      jest.spyOn(testimonialsService, 'findOne').mockResolvedValue(testimonial);

      const result = await controller.findOne(id);

      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should return a message with the updated id', async () => {
      const id = '1';
      const dataToUpdate = { testimonial: 'Text updated' };
      const result = { message: `Testimonial #${id} was updated` };
      jest
        .spyOn(testimonialsService, 'update')
        .mockResolvedValueOnce(undefined);

      expect(await controller.update(id, dataToUpdate)).toEqual(result);
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

      jest
        .spyOn(testimonialsService, 'getRandomTestimonials')
        .mockResolvedValue(Array(3));

      const response = await controller.pick();

      expect(response).toEqual(result);
      expect(response).toHaveLength(3);
    });
  });
});
