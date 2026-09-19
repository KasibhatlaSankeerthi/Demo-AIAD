const mockExecute = jest.fn();

jest.mock('../../src/config/db', () => ({
  execute: mockExecute,
}));

const { findUserByEmail } = require('../../src/services/authService');

describe('findUserByEmail', () => {
  beforeEach(() => {
    mockExecute.mockReset();
  });

  it('queries users by lowercase email for case-insensitive lookup', async () => {
    const user = { id: 1, email: 'MixedCase@Example.com' };
    mockExecute.mockResolvedValueOnce([[user]]);

    const result = await findUserByEmail('mixedcase@example.com');

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
