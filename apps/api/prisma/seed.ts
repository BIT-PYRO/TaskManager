import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.taskLabel.deleteMany();
  await prisma.taskMember.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.label.deleteMany();
  await prisma.team.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // ============ Create User ============
  const user = await prisma.user.create({
    data: {
      email: 'dexter@gmail.com',
      name: 'Dexter',
      username: 'Dexuser',
      title: 'Designer',
      avatarUrl: null,
      authProvider: 'guest',
    },
  });
  console.log('✅ Created user:', user.name);

  // ============ Create Workspace ============
  const workspace = await prisma.workspace.create({
    data: {
      name: "Dexter's Workspace",
    },
  });

  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'owner',
    },
  });
  console.log('✅ Created workspace:', workspace.name);

  // ============ Create User Preferences ============
  await prisma.userPreference.create({
    data: {
      userId: user.id,
      theme: 'light',
      colorMode: 'blue',
      taskView: 'board',
      visibleFields: {
        priority: true,
        members: true,
        dueDate: true,
        labels: true,
        status: true,
        reporter: true,
      },
    },
  });

  // ============ Create Teams ============
  const teams = await Promise.all([
    prisma.team.create({ data: { workspaceId: workspace.id, name: 'QA Team' } }),
    prisma.team.create({ data: { workspaceId: workspace.id, name: 'Dev Team' } }),
    prisma.team.create({ data: { workspaceId: workspace.id, name: 'Security' } }),
    prisma.team.create({ data: { workspaceId: workspace.id, name: 'Design Team' } }),
  ]);
  const [qaTeam, devTeam, securityTeam, designTeam] = teams;
  console.log('✅ Created', teams.length, 'teams');

  // ============ Create Labels ============
  const labelData = [
    { name: 'Research', color: '#8B5CF6' },
    { name: 'Design', color: '#EC4899' },
    { name: 'Development', color: '#3B82F6' },
    { name: 'Testing', color: '#10B981' },
    { name: 'Deployment', color: '#F59E0B' },
    { name: 'Updated', color: '#6366F1' },
    { name: 'Passed', color: '#22C55E' },
    { name: 'Audit', color: '#EF4444' },
    { name: 'Scheduled', color: '#8B5CF6' },
    { name: 'Optimization', color: '#14B8A6' },
    { name: 'Review', color: '#F97316' },
  ];

  const labels: Record<string, { id: string }> = {};
  for (const l of labelData) {
    const label = await prisma.label.create({
      data: { workspaceId: workspace.id, ...l },
    });
    labels[l.name] = label;
  }
  console.log('✅ Created', labelData.length, 'labels');

  // ============ Create Projects ============
  const projectDesignHomepage = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Design Homepage',
      description: 'Design and implement the main homepage for the application',
      priority: 'high',
      leadId: user.id,
      dueDate: new Date('2026-09-12'),
    },
  });

  const projectDevelopLogin = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Develop Login Feature',
      description: 'Build the authentication and login flow',
      priority: 'low',
      leadId: user.id,
      dueDate: new Date('2026-09-15'),
    },
  });

  const projectTestPayment = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Test Payment Gateway',
      description: 'Comprehensive testing of the payment gateway integration',
      priority: 'medium',
      leadId: user.id,
      dueDate: new Date('2026-09-18'),
    },
  });
  console.log('✅ Created 3 projects');

  // ============ Create Tasks ============

  // --- TO DO ---
  const task1 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Write API Documentation',
      description: 'Create comprehensive API documentation covering all endpoints, request/response schemas, authentication flows, and error handling. Include code examples and usage guidelines.',
      status: 'todo',
      priority: 'high',
      reporterId: user.id,
      teamId: devTeam.id,
      dueDate: new Date('2026-07-29'),
      position: 0,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Implement Search Function',
      description: 'Build a full-text search feature with debouncing and result highlighting.',
      status: 'todo',
      priority: 'medium',
      reporterId: user.id,
      teamId: devTeam.id,
      dueDate: new Date('2026-07-29'),
      position: 1,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Deploy to Production',
      description: 'Deploy the latest release to production servers with zero downtime.',
      status: 'todo',
      priority: 'urgent',
      reporterId: user.id,
      teamId: devTeam.id,
      dueDate: new Date('2026-07-29'),
      position: 2,
    },
  });

  // --- DOING ---
  const task4 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Code Review Completed',
      description: 'Review all pending pull requests and provide detailed feedback.',
      status: 'doing',
      priority: 'high',
      reporterId: user.id,
      teamId: devTeam.id,
      dueDate: new Date('2026-07-29'),
      position: 0,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Design Mockups Finalized',
      description: 'Finalize all design mockups and prepare them for developer handoff.',
      status: 'doing',
      priority: 'medium',
      reporterId: user.id,
      teamId: designTeam.id,
      dueDate: new Date('2026-07-29'),
      position: 1,
    },
  });

  // --- COMPLETED ---
  const task6 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Feature Testing Passed',
      description: 'All feature tests have passed with 100% coverage.',
      status: 'completed',
      priority: 'high',
      reporterId: user.id,
      teamId: qaTeam.id,
      dueDate: new Date('2026-07-30'),
      position: 0,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'UI Design Updated',
      description: 'Updated UI components to match the latest design system.',
      status: 'completed',
      priority: 'medium',
      reporterId: user.id,
      teamId: designTeam.id,
      dueDate: new Date('2026-07-31'),
      position: 1,
    },
  });

  const task8 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Security Audit Scheduled',
      description: 'Schedule and prepare for the quarterly security audit.',
      status: 'completed',
      priority: 'urgent',
      reporterId: user.id,
      teamId: securityTeam.id,
      dueDate: new Date('2026-08-01'),
      position: 2,
    },
  });

  // --- ON HOLD ---
  const task9 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'UI Review',
      description: 'Review UI components for accessibility and consistency.',
      status: 'on_hold',
      priority: 'low',
      reporterId: user.id,
      teamId: designTeam.id,
      dueDate: new Date('2026-08-05'),
      position: 0,
    },
  });

  const task10 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Backend Refactoring',
      description: 'Refactor backend services for better performance and maintainability.',
      status: 'on_hold',
      priority: 'medium',
      reporterId: user.id,
      teamId: devTeam.id,
      dueDate: new Date('2026-08-10'),
      position: 1,
    },
  });

  const task11 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'User Feedback Analysis',
      description: 'Analyze user feedback from the latest release and create action items.',
      status: 'on_hold',
      priority: 'low',
      reporterId: user.id,
      teamId: qaTeam.id,
      dueDate: new Date('2026-08-15'),
      position: 2,
    },
  });

  const task12 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      title: 'Performance Optimization',
      description: 'Optimize application performance including load times and API response times.',
      status: 'on_hold',
      priority: 'high',
      reporterId: user.id,
      teamId: devTeam.id,
      dueDate: new Date('2026-08-20'),
      position: 3,
    },
  });

  const allTasks = [task1, task2, task3, task4, task5, task6, task7, task8, task9, task10, task11, task12];
  console.log('✅ Created', allTasks.length, 'tasks');

  // ============ Assign Members to Tasks ============
  for (const task of allTasks) {
    await prisma.taskMember.create({
      data: { taskId: task.id, userId: user.id },
    });
  }

  // ============ Assign Labels to Tasks ============
  const taskLabelAssignments: { taskId: string; labelNames: string[] }[] = [
    { taskId: task1.id, labelNames: ['Deployment', 'Deployment'] },
    { taskId: task2.id, labelNames: ['Deployment', 'Deployment'] },
    { taskId: task3.id, labelNames: ['Deployment', 'Deployment'] },
    { taskId: task4.id, labelNames: ['Deployment', 'Deployment'] },
    { taskId: task5.id, labelNames: ['Deployment', 'Deployment'] },
    { taskId: task6.id, labelNames: ['Testing', 'Passed'] },
    { taskId: task7.id, labelNames: ['Design', 'Updated'] },
    { taskId: task8.id, labelNames: ['Audit', 'Scheduled'] },
    { taskId: task9.id, labelNames: ['Design', 'Review'] },
    { taskId: task10.id, labelNames: ['Development', 'Development'] },
    { taskId: task11.id, labelNames: ['Research', 'Research'] },
    { taskId: task12.id, labelNames: ['Optimization', 'Optimization'] },
  ];

  for (const assignment of taskLabelAssignments) {
    const uniqueLabels = [...new Set(assignment.labelNames)];
    for (const labelName of uniqueLabels) {
      if (labels[labelName]) {
        await prisma.taskLabel.create({
          data: { taskId: assignment.taskId, labelId: labels[labelName].id },
        });
      }
    }
  }
  console.log('✅ Assigned labels to tasks');

  // ============ Assign tasks to projects ============
  // Some tasks belong to projects (for project detail view)
  await prisma.task.update({ where: { id: task1.id }, data: { projectId: projectDesignHomepage.id } });
  await prisma.task.update({ where: { id: task4.id }, data: { projectId: projectDesignHomepage.id } });
  await prisma.task.update({ where: { id: task7.id }, data: { projectId: projectDesignHomepage.id } });
  await prisma.task.update({ where: { id: task2.id }, data: { projectId: projectDevelopLogin.id } });
  await prisma.task.update({ where: { id: task5.id }, data: { projectId: projectDevelopLogin.id } });
  await prisma.task.update({ where: { id: task3.id }, data: { projectId: projectTestPayment.id } });
  await prisma.task.update({ where: { id: task6.id }, data: { projectId: projectTestPayment.id } });

  // ============ Create Subtasks for Task 1 ============
  await prisma.subtask.createMany({
    data: [
      {
        taskId: task1.id,
        title: 'Define API endpoint structure',
        status: 'completed',
        priority: 'high',
        assigneeId: user.id,
        dueDate: new Date('2026-07-25'),
      },
      {
        taskId: task1.id,
        title: 'Write authentication docs',
        status: 'doing',
        priority: 'medium',
        assigneeId: user.id,
        dueDate: new Date('2026-07-27'),
      },
      {
        taskId: task1.id,
        title: 'Add code examples',
        status: 'todo',
        priority: 'low',
        assigneeId: user.id,
        dueDate: new Date('2026-07-29'),
      },
    ],
  });
  console.log('✅ Created subtasks');

  // ============ Create Comments for Task 1 ============
  await prisma.comment.createMany({
    data: [
      {
        taskId: task1.id,
        authorId: user.id,
        content: 'Started working on the API documentation. Will focus on authentication endpoints first.',
        createdAt: new Date('2026-07-20T10:00:00Z'),
      },
      {
        taskId: task1.id,
        authorId: user.id,
        content: 'Authentication docs are almost done. Moving on to the task management endpoints next.',
        createdAt: new Date('2026-07-22T14:30:00Z'),
      },
      {
        taskId: task1.id,
        authorId: user.id,
        content: 'Added request/response examples for all CRUD operations. Need to add error handling section.',
        createdAt: new Date('2026-07-25T09:15:00Z'),
      },
    ],
  });
  console.log('✅ Created comments');

  console.log('\n🎉 Seed completed successfully!');
  console.log(`   User: ${user.email}`);
  console.log(`   Workspace: ${workspace.name}`);
  console.log(`   Projects: 3`);
  console.log(`   Tasks: ${allTasks.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
