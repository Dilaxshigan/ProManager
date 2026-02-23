const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createActivityLog = async (tx, { action, entity, entityId, userId, metadata }) => {
    await tx.activityLog.create({
        data: { action, entity, entityId, userId, metadata }
    });
};

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, projectId, assignedToId } = req.body;

        // Verify project belongs to org
        const project = await prisma.project.findFirst({
            where: { id: projectId, workspace: { organizationId: req.organizationId } }
        });

        if (!project) return res.status(403).json({ message: 'Unauthorized' });

        const task = await prisma.$transaction(async (tx) => {
            const data = {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId,
                assignedToId: assignedToId || null,
                createdById: req.user.id
            };

            // Optional workflow fields
            const optional = ['startDate','estimatedHours','progress','notes','submittedById','reviewerName','reviewComments','approvalStatus','completedDate','finalComments','totalTimeSpent','clientApproval'];
            optional.forEach((k) => {
                if (req.body[k] !== undefined) {
                    if (k === 'startDate' || k === 'completedDate') data[k] = req.body[k] ? new Date(req.body[k]) : null;
                    else if (k === 'estimatedHours' || k === 'progress') data[k] = Number(req.body[k]);
                    else if (k === 'totalTimeSpent') data[k] = Number(req.body[k]);
                    else if (k === 'clientApproval') data[k] = Boolean(req.body[k]);
                    else data[k] = req.body[k];
                }
            });

            const newTask = await tx.task.create({ data });

            await createActivityLog(tx, {
                action: 'CREATE',
                entity: 'TASK',
                entityId: newTask.id,
                userId: req.user.id,
                metadata: { title: newTask.title }
            });

            return newTask;
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error creating task' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // sanitize and convert known fields
        const allowed = ['title','description','status','priority','dueDate','assignedToId','order','syncStatus','externalId','startDate','estimatedHours','progress','notes','submittedById','reviewerName','reviewComments','approvalStatus','completedDate','finalComments','totalTimeSpent','clientApproval'];
        const data = {};
        allowed.forEach((k) => {
            if (updateData[k] !== undefined) {
                if (k === 'dueDate' || k === 'startDate' || k === 'completedDate') data[k] = updateData[k] ? new Date(updateData[k]) : null;
                else if (k === 'estimatedHours' || k === 'progress' || k === 'order' || k === 'totalTimeSpent') data[k] = Number(updateData[k]);
                else if (k === 'clientApproval') data[k] = Boolean(updateData[k]);
                else data[k] = updateData[k];
            }
        });

        const task = await prisma.$transaction(async (tx) => {
            const currentTask = await tx.task.findFirst({
                where: { id, project: { workspace: { organizationId: req.organizationId } } }
            });

            if (!currentTask) throw new Error('NOT_FOUND');

            const updatedTask = await tx.task.update({
                where: { id },
                data
            });

            await createActivityLog(tx, {
                action: 'UPDATE',
                entity: 'TASK',
                entityId: id,
                userId: req.user.id,
                metadata: { updates: updateData, previous: currentTask }
            });

            return updatedTask;
        });

        res.json(task);
    } catch (error) {
        if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Task not found' });
        res.status(500).json({ message: 'Error updating task' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.deleteMany({
            where: { id, project: { workspace: { organizationId: req.organizationId } } }
        });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await prisma.task.findMany({
            where: { projectId, project: { workspace: { organizationId: req.organizationId } } },
            orderBy: { order: 'asc' },
            include: { assignedTo: { select: { id: true, firstName: true } } }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject
};
