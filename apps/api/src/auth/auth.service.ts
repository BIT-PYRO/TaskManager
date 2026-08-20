import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async guestLogin() {
    // Create a new guest user with a unique email
    const guestId = Math.random().toString(36).substring(2, 8);
    const user = await this.prisma.user.create({
      data: {
        email: `guest-${guestId}@pyramid.local`,
        name: 'Dexter',
        username: `Dexuser_${guestId}`,
        title: 'Designer',
        authProvider: 'guest',
      },
    });

    // Create workspace with seed data
    const workspace = await this.createDemoWorkspace(user.id);

    // Create preferences
    await this.prisma.userPreference.create({
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

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      workspaceId: workspace.id,
    });

    return { token, user, workspaceId: workspace.id };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaceMembers: {
          include: { workspace: true },
        },
      },
    });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaceMembers: {
          include: { workspace: true },
        },
        preferences: true,
      },
    });

    if (!user) return null;

    const workspace = user.workspaceMembers[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      title: user.title,
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      workspace: workspace
        ? {
            id: workspace.workspace.id,
            name: workspace.workspace.name,
            role: workspace.role,
          }
        : null,
      preferences: user.preferences,
    };
  }

  private async createDemoWorkspace(userId: string) {
    const workspace = await this.prisma.workspace.create({
      data: { name: "Dexter's Workspace" },
    });

    await this.prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: userId,
        role: 'owner',
      },
    });

    // Create teams
    const [qaTeam, devTeam, securityTeam, designTeam] = await Promise.all([
      this.prisma.team.create({ data: { workspaceId: workspace.id, name: 'QA Team' } }),
      this.prisma.team.create({ data: { workspaceId: workspace.id, name: 'Dev Team' } }),
      this.prisma.team.create({ data: { workspaceId: workspace.id, name: 'Security' } }),
      this.prisma.team.create({ data: { workspaceId: workspace.id, name: 'Design Team' } }),
    ]);

    // Create labels
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

    const labels: Record<string, string> = {};
    for (const l of labelData) {
      const label = await this.prisma.label.create({
        data: { workspaceId: workspace.id, ...l },
      });
      labels[l.name] = label.id;
    }

    // Create projects
    const [projectDesignHomepage, projectDevelopLogin, projectTestPayment] = await Promise.all([
      this.prisma.project.create({
        data: {
          workspaceId: workspace.id,
          name: 'Design Homepage',
          description: 'Design and implement the main homepage',
          priority: 'high',
          leadId: userId,
          dueDate: new Date('2026-09-12'),
        },
      }),
      this.prisma.project.create({
        data: {
          workspaceId: workspace.id,
          name: 'Develop Login Feature',
          description: 'Build the authentication and login flow',
          priority: 'low',
          leadId: userId,
          dueDate: new Date('2026-09-15'),
        },
      }),
      this.prisma.project.create({
        data: {
          workspaceId: workspace.id,
          name: 'Test Payment Gateway',
          description: 'Testing of the payment gateway integration',
          priority: 'medium',
          leadId: userId,
          dueDate: new Date('2026-09-18'),
        },
      }),
    ]);

    // Create tasks
    const taskConfigs = [
      { title: 'Write API Documentation', status: 'todo', priority: 'high', team: devTeam.id, date: '2026-07-29', pos: 0, project: projectDesignHomepage.id, labels: ['Deployment'] },
      { title: 'Implement Search Function', status: 'todo', priority: 'medium', team: devTeam.id, date: '2026-07-29', pos: 1, project: projectDevelopLogin.id, labels: ['Deployment'] },
      { title: 'Deploy to Production', status: 'todo', priority: 'urgent', team: devTeam.id, date: '2026-07-29', pos: 2, project: projectTestPayment.id, labels: ['Deployment'] },
      { title: 'Code Review Completed', status: 'doing', priority: 'high', team: devTeam.id, date: '2026-07-29', pos: 0, project: projectDesignHomepage.id, labels: ['Deployment'] },
      { title: 'Design Mockups Finalized', status: 'doing', priority: 'medium', team: designTeam.id, date: '2026-07-29', pos: 1, project: projectDevelopLogin.id, labels: ['Deployment'] },
      { title: 'Feature Testing Passed', status: 'completed', priority: 'high', team: qaTeam.id, date: '2026-07-30', pos: 0, project: projectTestPayment.id, labels: ['Testing', 'Passed'] },
      { title: 'UI Design Updated', status: 'completed', priority: 'medium', team: designTeam.id, date: '2026-07-31', pos: 1, project: projectDesignHomepage.id, labels: ['Design', 'Updated'] },
      { title: 'Security Audit Scheduled', status: 'completed', priority: 'urgent', team: securityTeam.id, date: '2026-08-01', pos: 2, project: null, labels: ['Audit', 'Scheduled'] },
      { title: 'UI Review', status: 'on_hold', priority: 'low', team: designTeam.id, date: '2026-08-05', pos: 0, project: null, labels: ['Design', 'Review'] },
      { title: 'Backend Refactoring', status: 'on_hold', priority: 'medium', team: devTeam.id, date: '2026-08-10', pos: 1, project: null, labels: ['Development'] },
      { title: 'User Feedback Analysis', status: 'on_hold', priority: 'low', team: qaTeam.id, date: '2026-08-15', pos: 2, project: null, labels: ['Research'] },
      { title: 'Performance Optimization', status: 'on_hold', priority: 'high', team: devTeam.id, date: '2026-08-20', pos: 3, project: null, labels: ['Optimization'] },
    ];

    for (const tc of taskConfigs) {
      const task = await this.prisma.task.create({
        data: {
          workspaceId: workspace.id,
          title: tc.title,
          description: `Description for ${tc.title}`,
          status: tc.status,
          priority: tc.priority,
          reporterId: userId,
          teamId: tc.team,
          projectId: tc.project,
          dueDate: new Date(tc.date),
          position: tc.pos,
        },
      });

      // Assign member
      await this.prisma.taskMember.create({
        data: { taskId: task.id, userId: userId },
      });

      // Assign labels
      for (const labelName of tc.labels) {
        if (labels[labelName]) {
          await this.prisma.taskLabel.create({
            data: { taskId: task.id, labelId: labels[labelName] },
          });
        }
      }

      // Add subtasks and comments to first task
      if (tc.title === 'Write API Documentation') {
        await this.prisma.subtask.createMany({
          data: [
            { taskId: task.id, title: 'Define API endpoint structure', status: 'completed', priority: 'high', assigneeId: userId, dueDate: new Date('2026-07-25') },
            { taskId: task.id, title: 'Write authentication docs', status: 'doing', priority: 'medium', assigneeId: userId, dueDate: new Date('2026-07-27') },
            { taskId: task.id, title: 'Add code examples', status: 'todo', priority: 'low', assigneeId: userId, dueDate: new Date('2026-07-29') },
          ],
        });

        await this.prisma.comment.createMany({
          data: [
            { taskId: task.id, authorId: userId, content: 'Started working on the API documentation. Will focus on authentication endpoints first.', createdAt: new Date('2026-07-20T10:00:00Z') },
            { taskId: task.id, authorId: userId, content: 'Authentication docs are almost done. Moving on to the task management endpoints next.', createdAt: new Date('2026-07-22T14:30:00Z') },
          ],
        });
      }
    }

    return workspace;
  }
}
