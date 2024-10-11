import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoy } from './user.repository';

describe('User', () => {
  let provider: UserRepositoy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepositoy],
    }).compile();

    provider = module.get<UserRepositoy>(UserRepositoy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
