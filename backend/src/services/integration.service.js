const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class IntegrationService {
    // Trello Integration Logic
    async getTrelloBoards(apiKey, token) {
        try {
            const { data } = await axios.get(`https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`);
            return data.map(board => ({
                id: board.id,
                name: board.name,
                url: board.url
            }));
        } catch (error) {
            throw new Error('Failed to fetch Trello boards');
        }
    }

    async syncTrelloBoard(projectId, apiKey, token, boardId, userId) {
        try {
            // Fetch Trello Cards
            const { data: cards } = await axios.get(`https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${token}`);

            // Map Trello cards to Tasks
            for (const card of cards) {
                await prisma.task.upsert({
                    where: { externalId: card.id },
                    update: {
                        title: card.name,
                        description: card.desc,
                        syncStatus: 'SYNCED'
                    },
                    create: {
                        title: card.name,
                        description: card.desc,
                        projectId: projectId,
                        externalId: card.id,
                        syncStatus: 'SYNCED',
                        createdById: userId
                    }
                });
            }

            await prisma.project.update({
                where: { id: projectId },
                data: { lastSyncedAt: new Date() }
            });

            return { success: true, count: cards.length };
        } catch (error) {
            throw new Error('Sync failed: ' + error.message);
        }
    }

    // Jira Integration Logic (Simplified OAuth/Basic Auth for demo)
    async getJiraProjects(domain, email, apiToken) {
        const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
        try {
            const { data } = await axios.get(`https://${domain}.atlassian.net/rest/api/3/project`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });
            return data.map(p => ({
                id: p.id,
                key: p.key,
                name: p.name
            }));
        } catch (error) {
            throw new Error('Failed to fetch Jira projects');
        }
    }

    async syncJiraProject(projectId, domain, email, apiToken, jiraProjectId, userId) {
        const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
        try {
            const { data } = await axios.get(`https://${domain}.atlassian.net/rest/api/3/search?jql=project=${jiraProjectId}`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });

            for (const issue of data.issues) {
                await prisma.task.upsert({
                    where: { externalId: issue.id },
                    update: {
                        title: issue.fields.summary,
                        description: issue.fields.description?.content?.[0]?.content?.[0]?.text || '',
                        syncStatus: 'SYNCED'
                    },
                    create: {
                        title: issue.fields.summary,
                        description: issue.fields.description?.content?.[0]?.content?.[0]?.text || '',
                        projectId: projectId,
                        externalId: issue.id,
                        syncStatus: 'SYNCED',
                        createdById: userId
                    }
                });
            }

            await prisma.project.update({
                where: { id: projectId },
                data: { lastSyncedAt: new Date() }
            });

            return { success: true, count: data.issues.length };
        } catch (error) {
            throw new Error('Jira sync failed');
        }
    }
}

module.exports = new IntegrationService();
