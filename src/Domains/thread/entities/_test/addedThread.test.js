const AddedThread = require('../addedThread')

describe('a AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        expect(() => new AddedThread({
            id:'thread-324',
            title:'This is title'
        })).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('should throw error when payload property did not meet data type needed', () => {
        expect(() => new AddedThread({
            id:'thread-123',
            title:'This is title',
            owner:123
        })).toThrowError('ADDED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED');
    })

    it('should create addedThread object correctly', () => {
        const payload = {
            id:'thread-123',
            title:'This is title',
            owner:'user-123'
        };
        const addedThread = new AddedThread(payload);
        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.owner).toEqual(payload.owner);
      });
    });
