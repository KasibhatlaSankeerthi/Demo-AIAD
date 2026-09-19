const mockExecute = jest.fn();

jest.mock('../../src/config/db', () => ({
  execute: mockExecute,
}));

const { findUserByEmail } = require('../../src/services/authService');

describe('findUserByEmail', () => {
  beforeEach(() => {
    mockExecute.mockReset();
  });

  it('normalizes email before querying for a case-insensitive lookup', async () => {
    const user = { id: 1, email: 'MixedCase@Example.com' };
    mockExecute.mockResolvedValueOnce([[user]]);

    const result = await findUserByEmail('  MixedCase@Example.com  ');

    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('WHERE LOWER(email) = ?'),
      ['mixedcase@example.com']
    );
    expect(result).toEqual(user);
  });

  it('returns null when no matching user is found', async () => {
    mockExecute.mockResolvedValueOnce([[]]);

    await expect(findUserByEmail('missing@example.com')).resolves.toBeNull();
  });
});
