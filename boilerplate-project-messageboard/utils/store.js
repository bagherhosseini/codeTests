class Store {
  constructor() {
    this.threads = new Map();
  }

  // Thread methods
  createThread(board, text, deletePassword) {
    const thread = {
      _id: Date.now().toString(),
      text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: deletePassword,
      replies: []
    };
    
    if (!this.threads.has(board)) {
      this.threads.set(board, []);
    }
    this.threads.get(board).unshift(thread);
    return thread;
  }

  getThreads(board) {
    const threads = this.threads.get(board) || [];
    return threads.slice(0, 10).map(thread => {
      const { delete_password, reported, ...threadData } = thread;
      return {
        ...threadData,
        replies: thread.replies.slice(-3).map(reply => {
          const { delete_password, reported, ...replyData } = reply;
          return replyData;
        })
      };
    });
  }

  // Reply methods
  addReply(board, threadId, text, deletePassword) {
    const thread = this.threads.get(board)?.find(t => t._id === threadId);
    if (!thread) return null;

    const reply = {
      _id: Date.now().toString(),
      text,
      created_on: new Date(),
      delete_password: deletePassword,
      reported: false
    };

    thread.replies.push(reply);
    thread.bumped_on = new Date();
    return reply;
  }

  // Other methods (delete, report, etc.)
  deleteThread(board, threadId, deletePassword) {
    const threads = this.threads.get(board);
    const threadIndex = threads?.findIndex(t => t._id === threadId);
    
    if (threadIndex === -1) return false;
    if (threads[threadIndex].delete_password !== deletePassword) return false;
    
    threads.splice(threadIndex, 1);
    return true;
  }

  deleteReply(board, threadId, replyId, deletePassword) {
    const thread = this.threads.get(board)?.find(t => t._id === threadId);
    if (!thread) return false;

    const reply = thread.replies.find(r => r._id === replyId);
    if (!reply || reply.delete_password !== deletePassword) return false;

    reply.text = '[deleted]';
    return true;
  }

  reportThread(board, threadId) {
    const thread = this.threads.get(board)?.find(t => t._id === threadId);
    if (!thread) return false;
    
    thread.reported = true;
    return true;
  }

  reportReply(board, threadId, replyId) {
    const thread = this.threads.get(board)?.find(t => t._id === threadId);
    if (!thread) return false;

    const reply = thread.replies.find(r => r._id === replyId);
    if (!reply) return false;

    reply.reported = true;
    return true;
  }
}

module.exports = new Store(); 