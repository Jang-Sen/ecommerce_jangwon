import { Test, TestingModule } from '@nestjs/testing';
import { AgreeOfTermService } from '../agree-of-term.service';

describe('AgreeOfTermService', () => {
  let service: AgreeOfTermService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgreeOfTermService],
    }).compile();

    service = module.get<AgreeOfTermService>(AgreeOfTermService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
