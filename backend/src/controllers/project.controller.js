const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (req, res) => {
    try {
        const { name, description, workspaceId, externalSource, externalId } = req.body;

        // Verify workspace belongs to organization
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, organizationId: req.organizationId }
        });

        if (!workspace) {
            return res.status(403).json({ message: 'Invalid workspace or unauthorized' });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                workspaceId,
                externalSource,
                externalId,
                members: { connect: { id: req.user.id } }
            }
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project' });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                workspace: { organizationId: req.organizationId }
            },
            include: {
                workspace: { select: { id: true, name: true } },
                members: { select: { id: true, firstName: true, email: true } },
                _count: { select: { tasks: true } }
            }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

const getProjectsByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const projects = await prisma.project.findMany({
            where: {
                workspaceId,
                workspace: { organizationId: req.organizationId }
            },
            include: {
                members: { select: { id: true, firstName: true, email: true } },
                _count: { select: { tasks: true } }
            }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await prisma.project.findFirst({
            where: { id, workspace: { organizationId: req.organizationId } }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: { name, description }
        });

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findFirst({
            where: { id, workspace: { organizationId: req.organizationId } }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await prisma.project.delete({ where: { id } });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project' });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectsByWorkspace,
    updateProject,
    deleteProject
};
