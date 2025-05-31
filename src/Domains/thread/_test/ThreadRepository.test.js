const ThreadRepository = require('../threadRepository.js')

describe('ThreadRepository Interface', ()=>{
    it('should throw error when invoke abstract behavior', async ()=>{
        
        const threadrepository = new ThreadRepository();

        await expect(threadrepository.addNewThread()).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(threadrepository.getThreadById()).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(threadrepository.verifyThreadExist()).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})