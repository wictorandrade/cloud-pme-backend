import { Test, TestingModule } from '@nestjs/testing';
import { Base64Helper } from './base64.helper';

describe('Base64Helper', () => {
  let base64Helper: Base64Helper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Base64Helper],
    }).compile();

    base64Helper = module.get<Base64Helper>(Base64Helper);
  });

  it('should encode and decode a string correctly', () => {
    const originalText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    const encodedText = base64Helper.encode(originalText);
    const decodedText = base64Helper.decode(encodedText);

    expect(encodedText).not.toBe(originalText);
    expect(decodedText).toBe(originalText);
  });
});
