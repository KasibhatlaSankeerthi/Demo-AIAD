const AppError = require('../../src/utils/AppError');
const asyncWrapper = require('../../src/utils/asyncWrapper');

describe('AppError', () => {
  it('sets message, statusCode, and isOperational', () => {
    const err = new AppError('not found', 404);
    expect(err.message).toBe('not found');
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
  });

  it('defaults statusCode to 500', () => {
    const err = new AppError('boom');
    expect(err.statusCode).toBe(500);
  });
});

describe('asyncWrapper', () => {
  it('forwards a rejected promise to next()', async () => {
    const error = new Error('fail');
    const handler = asyncWrapper(async () => {
      throw error;
    });
    const next = jest.fn();

    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('does not call next() when the handler resolves', async () => {
    const handler = asyncWrapper(async (req, res) => {
      res.done = true;
    });
    const next = jest.fn();
    const res = {};

    await handler({}, res, next);

    expect(res.done).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });
});
