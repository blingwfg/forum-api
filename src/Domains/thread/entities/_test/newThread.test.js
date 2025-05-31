const NewThread = require('../newThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain right property', () => {
    expect(() => new NewThread({
      title: 'something',
      content: 'something',
    })).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload contain wrong data type', () => {
    expect(() => new NewThread({
      title: 'something',
      body: 123,
    })).toThrowError('NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE');
  });

  it('should throw error if the title more than 50 character', () => {
    const payload = {
      title:
        'something longer than 50 character and it really hard to have such an error and you did not find it in your last code',
      body: 'this is body',
    };

    // Action and Assert

    expect(()=> new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_EXCEED_CHAR_LIMIT')

  });

   it('should persist added thread', () => {
        //arrange
        const payload = {
            title:'This is title',
            body:'something'
        };
        // Action and Assert

        const thread = new NewThread(payload)
        expect(thread.id).toEqual(payload.id)
        expect(thread.title).toEqual(payload.title)
        expect(thread.body).toEqual(payload.body)
      })
});
