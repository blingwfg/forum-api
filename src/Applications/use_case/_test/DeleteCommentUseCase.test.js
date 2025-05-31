const CommentRepository = require('../../../Domains/comment/commentRepository');
const OwnerValidator = require('../../security/OwnerValidator');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment', async () => {
    // Arrange
    const useCaseCommentId = 'comment-212';
    const useCaseThreadId = 'thread-212';
    const useCaseCredential = 'user-212';

    const commentAvailable = {
      id: useCaseCommentId,
      content: 'something content',
      created_at: '2025-05-28T10:00:00Z',
      user_id: useCaseCredential,
      thread_id: useCaseThreadId,
      is_delete: false,
    };

    const mockCommentRepository = new CommentRepository();
    const mockOwnerValidator = new OwnerValidator();

    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve(commentAvailable));
    mockOwnerValidator.verifyOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      ownerValidator: mockOwnerValidator,
    });

    // Act
    await deleteCommentUseCase.execute(useCaseCommentId, useCaseThreadId, useCaseCredential);

    // Assert
    expect(mockCommentRepository.getCommentById).toBeCalledWith(useCaseCommentId);
    expect(mockCommentRepository.getCommentById).toBeCalledTimes(1);

    expect(mockOwnerValidator.verifyOwner).toBeCalledWith(
      useCaseCredential,
      commentAvailable.user_id,
      'comment',
    );
    expect(mockOwnerValidator.verifyOwner).toBeCalledTimes(1);

    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential,
    );
    expect(mockCommentRepository.deleteComment).toBeCalledTimes(1);
  });
});
