const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;
        console.log('createWorkspace called with', { name, organizationId: req.organizationId, userId: req.user && req.user.id });
        const workspace = await prisma.workspace.create({
            data: {
                name,
                organizationId: req.organizationId
            }
        });

        res.status(201).json(workspace);
    } catch (error) {
        console.error('createWorkspace error:', error);
        res.status(500).json({ message: 'Error creating workspace', error: error.message });
    }
};

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: { organizationId: req.organizationId },
            include: {
                projects: {
                    include: {
                        _count: { select: { tasks: true } }
                    }
                }
            }
        });

        res.json(workspaces);
    } catch (error) {
        console.error('getWorkspaces error:', error);
        res.status(500).json({ message: 'Error fetching workspaces', error: error.message });
    }
};

const updateWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const workspace = await prisma.workspace.updateMany({
            where: {
                id,
                organizationId: req.organizationId
            },
            data: { name }
        });

        if (workspace.count === 0) {
            return res.status(404).json({ message: 'Workspace not found or unauthorized' });
        }

        res.json({ message: 'Workspace updated' });
    } catch (error) {
        console.error('updateWorkspace error:', error);
        res.status(500).json({ message: 'Error updating workspace', error: error.message });
    }
};

const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params;

        const workspace = await prisma.workspace.deleteMany({
            where: {
                id,
                organizationId: req.organizationId
            }
        });

        if (workspace.count === 0) {
            return res.status(404).json({ message: 'Workspace not found or unauthorized' });
        }

        res.json({ message: 'Workspace deleted' });
    } catch (error) {
        console.error('deleteWorkspace error:', error);
        res.status(500).json({ message: 'Error deleting workspace', error: error.message });
    }
};

module.exports = {
    createWorkspace,
    getWorkspaces,
    updateWorkspace,
    deleteWorkspace
};
