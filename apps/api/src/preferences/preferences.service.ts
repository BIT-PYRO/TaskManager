import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PreferencesService {
  constructor(private prisma: PrismaService) {}

  async get(userId: string) {
    let prefs = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await this.prisma.userPreference.create({
        data: {
          userId,
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
    }

    return prefs;
  }

  async update(userId: string, data: any) {
    // Merge visibleFields if provided
    if (data.visibleFields) {
      const existing = await this.get(userId);
      const currentFields = existing.visibleFields as any;
      data.visibleFields = { ...currentFields, ...data.visibleFields };
    }

    return this.prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        theme: data.theme || 'light',
        colorMode: data.colorMode || 'blue',
        taskView: data.taskView || 'board',
        visibleFields: data.visibleFields || {
          priority: true,
          members: true,
          dueDate: true,
          labels: true,
          status: true,
          reporter: true,
        },
      },
    });
  }
}
