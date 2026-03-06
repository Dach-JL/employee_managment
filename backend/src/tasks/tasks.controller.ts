import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Role } from '../users/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new task (Admin only)' })
    create(@Body() taskData: Partial<Task>) {
        return this.tasksService.create(taskData);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks (Admin views all, Employee views assigned)' })
    findAll(@Request() req) {
        return this.tasksService.findAll(req.user.role, req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a task by ID' })
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a task' })
    update(@Param('id') id: string, @Body() updateData: Partial<Task>, @Request() req) {
        return this.tasksService.update(id, updateData, req.user);
    }

    @Post(':id/attachments')
    @ApiOperation({ summary: 'Attach files to a task' })
    async attachFiles(@Param('id') id: string, @Body('attachments') attachments: any[]) {
        const task = await this.tasksService.findOne(id);
        const currentAttachments = task.attachments || [];
        return this.tasksService.update(id, { attachments: [...currentAttachments, ...attachments] } as any, { role: Role.ADMIN } as any);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a task (Admin only)' })
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}
