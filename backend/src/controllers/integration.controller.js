const integrationService = require('../services/integration.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connectTrello = async (req, res) => {
    try {
        const { apiKey, token } = req.body;
        // Test connection
        const boards = await integrationService.getTrelloBoards(apiKey, token);

        // Save integration
        await prisma.integration.upsert({
            where: { organizationId_type: { organizationId: req.organizationId, type: 'TRELLO' } },
            update: { config: { apiKey, token }, isActive: true },
            create: {
                organizationId: req.organizationId,
                type: 'TRELLO',
                config: { apiKey, token }
            }
        });

        res.json({ message: 'Trello connected', boards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const connectJira = async (req, res) => {
    try {
        const { domain, email, apiToken } = req.body;
        const projects = await integrationService.getJiraProjects(domain, email, apiToken);

        await prisma.integration.upsert({
            where: { organizationId_type: { organizationId: req.organizationId, type: 'JIRA' } },
            update: { config: { domain, email, apiToken }, isActive: true },
            create: {
                organizationId: req.organizationId,
                type: 'JIRA',
                config: { domain, email, apiToken }
            }
        });

        res.json({ message: 'Jira connected', projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIntegrations = async (req, res) => {
    try {
        const integrations = await prisma.integration.findMany({
            where: { organizationId: req.organizationId }
        });
        res.json(integrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching integrations' });
    }
};

const syncProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { workspace: true }
        });

        if (!project || project.workspace.organizationId !== req.organizationId) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const integration = await prisma.integration.findUnique({
            where: {
                organizationId_type: {
                    organizationId: req.organizationId,
                    type: project.externalSource
                }
            }
        });

        if (!integration) return res.status(400).json({ message: 'Integration not found' });

        let result;
        if (project.externalSource === 'TRELLO') {
            result = await integrationService.syncTrelloBoard(
                project.id,
                integration.config.apiKey,
                integration.config.token,
                project.externalId,
                req.user.id
            );
        } else if (project.externalSource === 'JIRA') {
            result = await integrationService.syncJiraProject(
                project.id,
                integration.config.domain,
                integration.config.email,
                integration.config.apiToken,
                project.externalId,
                req.user.id
            );
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    connectTrello,
    connectJira,
    getIntegrations,
    syncProject
};
