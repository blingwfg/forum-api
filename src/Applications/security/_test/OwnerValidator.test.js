const OwnerValidator = require('../OwnerValidator');

describe('OwnerValidator interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    await expect((new OwnerValidator()).verifyOwner('', '', '')).rejects.toThrowError('OWNER_VALIDATOR.METHOD_NOT_IMPLEMENTED');
  });
});
