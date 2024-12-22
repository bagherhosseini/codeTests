'use strict';

const express = require('express');
const router = express.Router();
const store = require('../utils/store.js');

router.post('/threads/:board', (req, res) => {
  const { text, delete_password } = req.body;
  const board = req.params.board;
  
  const thread = store.createThread(board, text, delete_password);
  res.json(thread);
});

router.get('/threads/:board', (req, res) => {
  const board = req.params.board;
  const threads = store.getThreads(board);
  res.json(threads);
});

router.delete('/threads/:board', (req, res) => {
  const { thread_id, delete_password } = req.body;
  const board = req.params.board;
  
  const success = store.deleteThread(board, thread_id, delete_password);
  res.send(success ? 'success' : 'incorrect password');
});

router.put('/threads/:board', (req, res) => {
  const { thread_id } = req.body;
  const board = req.params.board;
  
  const success = store.reportThread(board, thread_id);
  res.send(success ? 'reported' : 'error');
});

router.post('/replies/:board', (req, res) => {
  const { thread_id, text, delete_password } = req.body;
  const board = req.params.board;
  
  const reply = store.addReply(board, thread_id, text, delete_password);
  res.json(reply || { error: 'Thread not found' });
});

router.get('/replies/:board', (req, res) => {
  const board = req.params.board;
  const thread_id = req.query.thread_id;
  const thread = store.getThreads(board).find(t => t._id === thread_id);
  res.json(thread || { error: 'Thread not found' });
});

router.delete('/replies/:board', (req, res) => {
  const { thread_id, reply_id, delete_password } = req.body;
  const board = req.params.board;
  
  const success = store.deleteReply(board, thread_id, reply_id, delete_password);
  res.send(success ? 'success' : 'incorrect password');
});

router.put('/replies/:board', (req, res) => {
  const { thread_id, reply_id } = req.body;
  const board = req.params.board;
  
  if (!thread_id || !reply_id) {
    return res.status(400).send('thread_id and reply_id are required');
  }

  const success = store.reportReply(board, thread_id, reply_id);
  if (!success) {
    return res.status(200).send('error');
  }
  
  return res.status(200).send('reported');
});

module.exports = router;
