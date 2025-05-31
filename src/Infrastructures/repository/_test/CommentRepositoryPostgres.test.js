const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comment/entities/newComment');
const CommentRepositoryPostgress = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comment/entities/addedComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  // Pre-requisite
  const userId = 'user-123';
  const threadId = 'thread-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist added comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'This is a comment',
      });

      const fakeIdGenerator = () => '222';
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment.content, threadId, userId);

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById('comment-222');

      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'This is a comment',
      });

      const fakeIdGenerator = () => '222';
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment.content, threadId, userId);


      // Assert

       expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-222',
          content: 'This is a comment',
          owner: userId,
        }),
      );
    });
  });

  describe('getCommentById', () => {
    it('should return NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('wrong-comment')).rejects.toThrowError(NotFoundError);
    });

    it('should return comment correctly', async () => {
      // Arrange

      const payload ={ 
        id : 'comment-123',
        content : 'This is comment',
        created_at : new Date(),
        user_id : 'user-123',
        thread_id : 'thread-123',
        is_delete : false,
      }
      await CommentsTableTestHelper.addComment(payload);
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment.id).toEqual('comment-123');
      expect(comment.content).toEqual(payload.content);
      expect(comment.created_at).toEqual(payload.created_at);
      expect(comment.userId).toEqual(payload.userId);
      expect(comment.thread_id).toEqual(payload.thread_id);
      expect(comment.is_delete).toEqual(payload.is_delete);

    });
  });

  describe('getCommentByThreadId', () => {
    it('should return comments correctly', async () => {
      // Arrange

      const payload = [{
        id: 'comment-333',
        created_at : new Date(),
        
      },
       {
        id: 'comment-222',
        created_at : new Date(),
      },
       {
        id: 'comment-111',
        created_at : new Date(),
      }
    ]

      for (const data in payload){
          //some attribute create by CommentsTableTestHelper (you know that)
          await CommentsTableTestHelper.addComment({ id: payload[data].id, created_at : payload[data].created_at, user_id: userId, thread_id: threadId });
      }
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(threadId);
      // Assert
      expect(comments).toHaveLength(3);
      
      comments.forEach((commentData, i) => {
        expect(commentData).toEqual(
          { 
            id : payload[i].id,
          content : 'This is comment',
          created_at : payload[i].created_at,
          user_id : userId,
          thread_id : threadId,
          is_delete : false,}
        )
      })
    });

    it('should return empty array if there is no comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(threadId);

      // Assert
      expect(Array.isArray(comments)).toBeTruthy;
      expect(comments).toHaveLength(0);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment correctly and persist comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-333',
        user_id: userId,
        thread_id: threadId,
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-333', threadId, userId);
      const deletedComment = await CommentsTableTestHelper.getCommentById('comment-333');

      // Assert
      expect(deletedComment[0].is_delete).toEqual(true);
    });

    it('should return InvariantError when failed to delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment('comment-111', 'thread-121', 'user-123'),
      ).rejects.toThrowError(InvariantError);
    });
  });
});
