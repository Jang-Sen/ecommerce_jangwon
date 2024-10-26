import { Test, TestingModule } from '@nestjs/testing';
import { AgreeOfTermController } from '../agree-of-term.controller';
import { AgreeOfTermService } from '../agree-of-term.service';

describe('AgreeOfTermController', () => {
  let controller: AgreeOfTermController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreeOfTermController],
      providers: [AgreeOfTermService],
    }).compile();

    controller = module.get<AgreeOfTermController>(AgreeOfTermController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
