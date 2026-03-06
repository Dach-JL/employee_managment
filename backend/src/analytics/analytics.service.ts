import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../tasks/entities/task.entity';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getTaskStats() {
        const stats = await this.taskRepository
            .createQueryBuilder('task')
            .select('task.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('task.status')
            .getRawMany();

        return stats;
    }

    async getPriorityStats() {
        const stats = await this.taskRepository
            .createQueryBuilder('task')
            .select('task.priority', 'priority')
            .addSelect('COUNT(*)', 'count')
            .groupBy('task.priority')
            .getRawMany();

        return stats;
    }

    async getSystemOverview() {
        const [taskCount, reportCount, userCount] = await Promise.all([
            this.taskRepository.count(),
            this.reportRepository.count(),
            this.userRepository.count(),
        ]);

        return {
            totalTasks: taskCount,
            totalReports: reportCount,
            totalEmployees: userCount,
        };
    }

    async getRecentActivity() {
        const [recentTasks, recentReports] = await Promise.all([
            this.taskRepository.find({ order: { createdAt: 'DESC' }, take: 5, relations: ['assignee'] }),
            this.reportRepository.find({ order: { createdAt: 'DESC' }, take: 5, relations: ['author'] }),
        ]);

        return {
            recentTasks,
            recentReports,
        };
    }
}
