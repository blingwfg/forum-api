const ThreadRepository = require('../../../Domains/thread/threadRepository');
const AddedThread = require('../../../Domains/thread/entities/addedThread');
const AddThreadUseCase = require('../AddThreadUseCase');
const NewThread = require('../../../Domains/thread/entities/newThread');

describe('AddThreadUseCase', () => {

  it('should orchestrating the add thread action correctly', async () => {
    const Payload = {
      title: 'Title for thread',
      body: 'This is body for thread',
    };

    const Credential = {
      id: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Title for thread',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addNewThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));


    const getThreadUsecase = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    const addedThread = await getThreadUsecase.execute(Payload, Credential);

    //assert
    expect(mockAddedThread.id).toEqual('thread-123')
    expect(mockAddedThread.title).toEqual('Title for thread')
    expect(mockAddedThread.owner).toEqual('user-123')
    expect(mockAddedThread).toBeInstanceOf(AddedThread)


    expect(mockThreadRepository).toBeInstanceOf(ThreadRepository)



    expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Title for thread',
        owner: 'user-123',
      }))

    expect(mockThreadRepository.addNewThread).toBeCalledWith(
      new NewThread({
        title: Payload.title,
        body: Payload.body,
      }),
      Credential
    );
    
    
  });
});
