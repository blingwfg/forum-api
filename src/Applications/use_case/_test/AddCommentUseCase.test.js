const CommentRepository = require('../../../Domains/comment/commentRepository');
const ThreadRepository = require('../../../Domains/thread/threadRepository');
const NewComment = require('../../../Domains/comment/entities/newComment');
const AddedComment = require('../../../Domains/comment/entities/addedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment correctly', async () => {
    // Arrange
    const payload = {
      content: 'This is comment',
    };

    const credential = {
      id: 'user-123',
    };

    const threadId = 'thread-123';

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: payload.content,
      owner: credential.id,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(mockAddedComment);

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedComment = await addCommentUseCase.execute(payload, threadId, credential.id);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyThreadExist).toBeCalledTimes(1);

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({ content: payload.content }).content,
      threadId,
      credential.id
    );
    expect(mockCommentRepository.addComment).toBeCalledTimes(1);

    expect(addedComment).toStrictEqual(mockAddedComment);
  });
});
