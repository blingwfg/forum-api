const ThreadDetails = require('../../Domains/thread/entities/threadDetails');
const CommentDetails = require('../../Domains/comment/entities/commentDetails');

class GetDetailsThreadUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;

  }

  async execute(useCaseThreadId) {
    // get thread
    const threadFromDb = await this._threadRepository.getThreadById(useCaseThreadId);
    const { username: threadUsername } = await this._userRepository.getUserById(threadFromDb.user_id);
    const thread = new ThreadDetails({
      id: threadFromDb.id,
      title: threadFromDb.title,
      body: threadFromDb.body,
      date: threadFromDb.created_at.toString(),
      username: threadUsername,
      comments: [],
    });
    // get comments by thread
    const commentsInThread = await this._commentRepository.getCommentByThreadId(thread.id);
    if (commentsInThread.length > 0) {
      for (const commentData of commentsInThread) {
        const { username: commentUsername } = await this._userRepository.getUserById(commentData.user_id);
        const commentDetails = new CommentDetails({
          id: commentData.id,
          content: commentData.is_delete ? "**komentar telah dihapus**" : commentData.content,
          date: commentData.created_at.toString(),
          username: commentUsername,
          replies: [],
        });

        thread.comments.push(commentDetails);
      }
    }
    return thread;
  }
}

module.exports = GetDetailsThreadUseCase;
