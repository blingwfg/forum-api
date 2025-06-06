const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/thread/entities/addedThread');
const NewThread = require('../../../Domains/thread/entities/newThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  // Pre-requisite
  const userId = 'user-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addNewThread function', () => {
    it('should persist added thread ', async () => {
      //Arrange
      const newThread = new NewThread({
        title: 'First thread',
        body: 'This is a new thread',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //Action
      await threadRepositoryPostgres.addNewThread(newThread, userId);

      //Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(threads).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      //Arrange

      const newThread = new NewThread({
        title: 'First thread',
        body: 'This is a new thread',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //Action
      const addedThread = await threadRepositoryPostgres.addNewThread(newThread, userId);

      //Assert

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'First thread',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if no thread found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-521')).rejects.toThrowError(NotFoundError);
    });

    it('should get the right thread', async () => {
      // Arrange
      const created_at = new Date()
      await ThreadsTableTestHelper.addThread({ id: 'thread-521', title: 'Thread test', created_at });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-521');

      // Assert
      expect(thread).toEqual({
        id : 'thread-521',
        title : 'Thread test',
        body : 'This is helper thread',
        created_at,
        user_id : 'user-123',
  });
    });
  });
  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError if no thread found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-521')).rejects.toThrowError(NotFoundError);
    });

  });
});
