const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { assert } = chai;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testThreadId;
  let testReplyId;
  const testBoard = 'test';
  const testPassword = 'testpass123';
  const wrongPassword = 'wrongpass123';

  // 1. Creating a new thread
  test('POST /api/threads/{board}', function(done) {
    chai.request(server)
      .post(`/api/threads/${testBoard}`)
      .send({
        text: 'Test Thread',
        delete_password: testPassword
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'bumped_on');
        assert.property(res.body, 'replies');
        testThreadId = res.body._id;
        done();
      });
  });

  // 2. Viewing the 10 most recent threads with 3 replies each
  test('GET /api/threads/{board}', function(done) {
    chai.request(server)
      .get(`/api/threads/${testBoard}`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtMost(res.body.length, 10);
        assert.property(res.body[0], '_id');
        assert.property(res.body[0], 'text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'bumped_on');
        assert.property(res.body[0], 'replies');
        assert.isAtMost(res.body[0].replies.length, 3);
        assert.notProperty(res.body[0], 'delete_password');
        assert.notProperty(res.body[0], 'reported');
        done();
      });
  });

  // 3. Deleting a thread with incorrect password
  test('DELETE /api/threads/{board} with invalid password', function(done) {
    chai.request(server)
      .delete(`/api/threads/${testBoard}`)
      .send({
        thread_id: testThreadId,
        delete_password: wrongPassword
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      });
  });

  // 4. Reporting a thread
  test('PUT /api/threads/{board}', function(done) {
    chai.request(server)
      .put(`/api/threads/${testBoard}`)
      .send({
        thread_id: testThreadId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        done();
      });
  });

  // 5. Creating a new reply
  test('POST /api/replies/{board}', function(done) {
    chai.request(server)
      .post(`/api/replies/${testBoard}`)
      .send({
        thread_id: testThreadId,
        text: 'Test Reply',
        delete_password: testPassword
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'text');
        assert.property(res.body, 'created_on');
        testReplyId = res.body._id;
        done();
      });
  });

  // 6. Viewing a single thread with all replies
  test('GET /api/replies/{board}', function(done) {
    chai.request(server)
      .get(`/api/replies/${testBoard}`)
      .query({ thread_id: testThreadId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'bumped_on');
        assert.property(res.body, 'replies');
        assert.isArray(res.body.replies);
        assert.notProperty(res.body, 'delete_password');
        assert.notProperty(res.body, 'reported');
        assert.notProperty(res.body.replies[0], 'delete_password');
        assert.notProperty(res.body.replies[0], 'reported');
        done();
      });
  });

  // 7. Deleting a reply with incorrect password
  test('DELETE /api/replies/{board} with invalid password', function(done) {
    chai.request(server)
      .delete(`/api/replies/${testBoard}`)
      .send({
        thread_id: testThreadId,
        reply_id: testReplyId,
        delete_password: wrongPassword
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      });
  });

  // 8. Reporting a reply
  test('PUT /api/replies/{board}', function(done) {
    chai.request(server)
      .put(`/api/replies/${testBoard}`)
      .send({
        thread_id: testThreadId,
        reply_id: testReplyId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        done();
      });
  });

  // 9. Deleting a reply with correct password
  test('DELETE /api/replies/{board} with valid password', function(done) {
    chai.request(server)
      .delete(`/api/replies/${testBoard}`)
      .send({
        thread_id: testThreadId,
        reply_id: testReplyId,
        delete_password: testPassword
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        done();
      });
  });

  // 10. Deleting a thread with correct password
  test('DELETE /api/threads/{board} with valid password', function(done) {
    chai.request(server)
      .delete(`/api/threads/${testBoard}`)
      .send({
        thread_id: testThreadId,
        delete_password: testPassword
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        done();
      });
  });
});
