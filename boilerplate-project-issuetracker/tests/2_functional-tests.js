const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testId;

  test('Create an issue with every field', function(done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Test Issue',
        issue_text: 'Test issue text',
        created_by: 'Tester',
        assigned_to: 'Assignee',
        status_text: 'In Progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.equal(res.body.issue_title, 'Test Issue');
        assert.equal(res.body.issue_text, 'Test issue text');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, 'Assignee');
        assert.equal(res.body.status_text, 'In Progress');
        assert.isBoolean(res.body.open);
        assert.isTrue(res.body.open);
        testId = res.body._id;
        done();
      });
  });

  test('Create an issue with only required fields', function(done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Test Issue',
        issue_text: 'Test issue text',
        created_by: 'Tester'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Test Issue');
        assert.equal(res.body.issue_text, 'Test issue text');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        done();
      });
  });

  test('Create an issue with missing required fields', function(done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Test Issue'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });

  test('View issues on a project', function(done) {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
  });

  test('View issues on a project with one filter', function(done) {
    chai
      .request(server)
      .get('/api/issues/apitest?open=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  test('View issues on a project with multiple filters', function(done) {
    chai
      .request(server)
      .get('/api/issues/apitest?open=true&created_by=Tester')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach((issue) => {
          assert.equal(issue.open, true);
          assert.equal(issue.created_by, 'Tester');
        });
        done();
      });
  });

  test('Update one field on an issue', function(done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: testId,
        issue_title: 'Updated Title'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test('Update multiple fields on an issue', function(done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: testId,
        issue_title: 'Updated Title',
        issue_text: 'Updated Text'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test('Update an issue with missing _id', function(done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        issue_title: 'Updated Title'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  test('Update an issue with no fields to update', function(done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: testId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });

  test('Update an issue with an invalid _id', function(done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: 'invalid_id',
        issue_title: 'Updated Title'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        done();
      });
  });

  test('Delete an issue', function(done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({
        _id: testId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test('Delete an issue with an invalid _id', function(done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({
        _id: 'invalid_id'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      });
  });

  test('Delete an issue with missing _id', function(done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
});