import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    async create(taskData: Partial<Task>): Promise<Task> {
        const task = this.tasksRepository.create(taskData);
        return this.tasksRepository.save(task);
    }

    async findAll(role: string, userId: string): Promise<Task[]> {
        if (role === 'admin') {
            return this.tasksRepository.find({ relations: ['assignee'] });
        }
        return this.tasksRepository.find({
            where: { assignee: { id: userId } },
            relations: ['assignee'],
        });
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['assignee'],
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    async update(id: string, updateData: Partial<Task>, user: User): Promise<Task> {
        const task = await this.findOne(id);

        // Employees can only update status of their own tasks
        if (user.role !== 'admin' && task.assignee?.id !== user.id) {
            throw new ForbiddenException('You can only update your own tasks');
        }

        if (user.role !== 'admin') {
            // Employees can only update status
            const { status } = updateData;
            if (status) {
                task.status = status;
            }
            return this.tasksRepository.save(task);
        }

        // Admins can update everything
        Object.assign(task, updateData);
        return this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findOne(id);
        await this.tasksRepository.remove(task);
    }
}
