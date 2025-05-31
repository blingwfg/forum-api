const NewComment = require('../../Domains/comment/entities/newComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseThreadId, useCaseCredential) {
    const { content } = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadExist(useCaseThreadId);
    return await this._commentRepository.addComment(content, useCaseThreadId, useCaseCredential);
  }
}

module.exports = AddCommentUseCase;
