import { IsString, IsOptional, IsArray, IsDateString, IsIn, IsInt } from 'class-validator';

const STATUSES = ['todo', 'doing', 'completed', 'on_hold'];
const PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'];

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: string;

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  reporterId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelIds?: string[];
}
