const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const workspaceController = require('../controllers/workspace.controller');
const projectController = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');
const integrationController = require('../controllers/integration.controller');
const { authenticate, tenantHandler, authorize } = require('../middleware/auth.middleware');

// Public routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Protected routes (Tenant Isolation applied)
router.use(authenticate, tenantHandler);

// Workspace routes
router.post('/workspaces', workspaceController.createWorkspace);
router.get('/workspaces', workspaceController.getWorkspaces);
router.put('/workspaces/:id', workspaceController.updateWorkspace);
router.delete('/workspaces/:id', authorize(['OWNER', 'ADMIN']), workspaceController.deleteWorkspace);

// Project routes
router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getProjects);
router.get('/workspaces/:workspaceId/projects', projectController.getProjectsByWorkspace);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Task routes
router.post('/tasks', taskController.createTask);
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Integration routes
router.get('/integrations', integrationController.getIntegrations);
router.post('/integrations/trello', integrationController.connectTrello);
router.post('/integrations/jira', integrationController.connectJira);
router.post('/projects/:projectId/sync', integrationController.syncProject);

module.exports = router;
