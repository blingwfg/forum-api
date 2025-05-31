const CommentRepository = require('../../../Domains/comment/commentRepository');
const ThreadRepository = require('../../../Domains/thread/threadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetDetailsThreadUseCase = require('../GetDetailsThreadUseCase');
const ThreadDetails = require('../../../Domains/thread/entities/threadDetails'); // Import entity-nya

describe('GetDetailsThreadUseCase', () => {
  it('should orchestrating get the details thread with comments', async () => {
    // Arrange
    const userArnold = {
      id: 'user-111',
      username: 'Arnold Szechuan',
      fullname: 'Arnold Szechuan', 
      password: 'pass12345', 
    };

    const mockThreadData = {
      id: 'thread-123',
      title: 'this is title thread',
      body: 'this is body',
      created_at: '2025-05-18 20:38:31.448',
      user_id: 'user-111',
    };

    const commentData = [
      {
        id: 'comment-123',
        content: 'this is first',
        created_at: '2025-05-17 20:38:31.448',
        user_id: 'user-111',
        thread_id: 'thread-123',
        is_delete: false,
      },
      {
        id: 'comment-222',
        content: 'this is second without reply',
        created_at: '2025-05-17 20:38:31.448',
        user_id: 'user-111',
        thread_id: 'thread-123',
        is_delete: false,
      },
    ];

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThreadData);
    mockCommentRepository.getCommentByThreadId = jest.fn().mockResolvedValue(commentData);
    mockUserRepository.getUserById = jest.fn().mockResolvedValue(userArnold);

    const useCase = new GetDetailsThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Act
    const threadDetails = await useCase.execute('thread-123');

    // Assert
    expect(threadDetails).toBeInstanceOf(ThreadDetails);
    expect(threadDetails).toMatchObject({
      id: 'thread-123',
      title: 'this is title thread',
      body: 'this is body',
      date: '2025-05-18 20:38:31.448',
      username: 'Arnold Szechuan',
      comments: [
        {
          id: 'comment-123',
          content: 'this is first',
          date: '2025-05-17 20:38:31.448',
          username: 'Arnold Szechuan',
        },
        {
          id: 'comment-222',
          content: 'this is second without reply',
          date: '2025-05-17 20:38:31.448',
          username: 'Arnold Szechuan',
        },
      ],
    });
  });

  it('should return ThreadDetails with empty comments array if there are no comments', async () => {
    const userArnold = {
      id: 'user-111',
      username: 'Arnold Szechuan',
      fullname: 'Arnold Szechuan',
      password: 'pass12345',
    };

    const mockThreadData = {
      id: 'thread-123',
      title: 'this is title thread',
      body: 'this is body',
      created_at: '2025-05-18 20:38:31.448',
      user_id: 'user-111',
    };

    const commentData = [];

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThreadData);
    mockUserRepository.getUserById = jest.fn().mockResolvedValue(userArnold);
    mockCommentRepository.getCommentByThreadId = jest.fn().mockResolvedValue(commentData);

    const useCase = new GetDetailsThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const threadDetails = await useCase.execute('thread-123');

    expect(threadDetails).toBeInstanceOf(ThreadDetails);
    expect(threadDetails).toEqual({
      id: 'thread-123',
      title: 'this is title thread',
      body: 'this is body',
      date: '2025-05-18 20:38:31.448',
      username: 'Arnold Szechuan',
      comments: [],
    });
  });

  it('should return "**komentar telah dihapus**" if comment is marked as deleted', async () => {
    const userArnold = {
      id: 'user-111',
      username: 'Arnold Szechuan',
      fullname: 'Arnold Szechuan',
      password: 'pass12345',
    };

    const mockThreadData = {
      id: 'thread-123',
      title: 'this is title thread',
      body: 'this is body',
      created_at: '2025-05-18 20:38:31.448',
      user_id: 'user-111',
    };

    const commentData = [
      {
        id: 'comment-123',
        content: 'this is secret',
        is_delete: true,
        created_at: '2025-05-17 20:38:31.448',
        user_id: 'user-111',
        thread_id: 'thread-123',
      },
    ];

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThreadData);
    mockUserRepository.getUserById = jest.fn().mockResolvedValue(userArnold);
    mockCommentRepository.getCommentByThreadId = jest.fn().mockResolvedValue(commentData);

    const useCase = new GetDetailsThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const threadDetails = await useCase.execute('thread-123');

    expect(threadDetails).toBeInstanceOf(ThreadDetails);
    expect(threadDetails.comments).toHaveLength(1);
    expect(threadDetails.comments[0]).toMatchObject({
      id: 'comment-123',
      content: '**komentar telah dihapus**',
      date: '2025-05-17 20:38:31.448',
      username: 'Arnold Szechuan',
    });
  });
});
