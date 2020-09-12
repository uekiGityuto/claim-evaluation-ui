import { JPDateAdapter } from './jp-date-adapter.service';

describe('JpDateAdapter', () => {
  it('should create an instance', () => {
    expect(new JPDateAdapter('', null)).toBeTruthy();
  });
});
