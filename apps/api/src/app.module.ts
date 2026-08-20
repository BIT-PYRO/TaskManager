import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PreferencesModule } from './preferences/preferences.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { CommentsModule } from './comments/comments.module';
import { LabelsModule } from './labels/labels.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PreferencesModule,
    WorkspacesModule,
    TasksModule,
    ProjectsModule,
    SubtasksModule,
    CommentsModule,
    LabelsModule,
    TeamsModule,
  ],
})
export class AppModule {}
