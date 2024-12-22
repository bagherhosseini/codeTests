const router = require('express').Router();

let issues = new Map();

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(function (req, res) {
      const { project } = req.params;
      const projectIssues = issues.get(project) || [];

      let filteredIssues = projectIssues.filter(issue => {
        return Object.keys(req.query).every(key =>
          issue[key] === req.query[key] ||
          (key === 'open' && issue[key] === (req.query[key] === 'true'))
        );
      });

      res.json(filteredIssues);
    })

    .post(function (req, res) {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const newIssue = {
        _id: generateId(),
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      };

      if (!issues.has(project)) {
        issues.set(project, []);
      }

      issues.get(project).push(newIssue);
      res.json(newIssue);
    })

    .put(function (req, res) {
      const { project } = req.params;
      const { _id, ...updates } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      if (Object.keys(updates).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      const projectIssues = issues.get(project);
      if (!projectIssues) {
        return res.json({ error: 'could not update', _id });
      }

      const issueIndex = projectIssues.findIndex(issue => issue._id === _id);
      if (issueIndex === -1) {
        return res.json({ error: 'could not update', _id });
      }

      Object.assign(projectIssues[issueIndex], updates, {
        updated_on: new Date()
      });

      res.json({ result: 'successfully updated', _id });
    })

    .delete(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      const projectIssues = issues.get(project);
      if (!projectIssues) {
        return res.json({ error: 'could not delete', _id });
      }

      const issueIndex = projectIssues.findIndex(issue => issue._id === _id);
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', _id });
      }

      projectIssues.splice(issueIndex, 1);
      res.json({ result: 'successfully deleted', _id });
    });
};