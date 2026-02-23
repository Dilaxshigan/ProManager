const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Organization
    const org = await prisma.organization.create({
        data: {
            name: 'Acme Corp',
            slug: 'acme-corp',
        }
    });

    // 2. Create User
    const user = await prisma.user.create({
        data: {
            email: 'admin@acme.com',
            password,
            firstName: 'Admin',
            lastName: 'User',
            role: 'OWNER',
            organizationId: org.id
        }
    });

    // 3. Create Workspace
    const workspace = await prisma.workspace.create({
        data: {
            name: 'Engineering',
            organizationId: org.id
        }
    });

    // 4. Create Project
    const project = await prisma.project.create({
        data: {
            name: 'Mobile App Refactor',
            description: 'Rewriting the core mobile experience in React Native.',
            workspaceId: workspace.id,
            members: { connect: { id: user.id } }
        }
    });

    // 5. Create Tasks
    await prisma.task.createMany({
        data: [
            {
                title: 'Design UI System',
                status: 'DONE',
                priority: 'HIGH',
                projectId: project.id,
                createdById: user.id,
                assignedToId: user.id
            },
            {
                title: 'Setup Backend Boilerplate',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                projectId: project.id,
                createdById: user.id,
                assignedToId: user.id
            },
            {
                title: 'Integrate Auth Module',
                status: 'TODO',
                priority: 'URGENT',
                projectId: project.id,
                createdById: user.id,
                assignedToId: user.id
            }
        ]
    });

    console.log('Seeding completed successfully!');
    console.log('Login with: admin@acme.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
