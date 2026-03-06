import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report } from './entities/report.entity';
import { AnonymousReport } from './entities/anonymous-report.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        @InjectRepository(AnonymousReport)
        private anonymousReportsRepository: Repository<AnonymousReport>,
    ) { }

    // Daily Reports
    async createDailyReport(userData: User, reportData: Partial<Report>): Promise<Report> {
        const today = new Date().toISOString().split('T')[0];

        // Check if report for today already exists
        const existingReport = await this.reportsRepository.findOne({
            where: {
                author: { id: userData.id },
                reportDate: today
            },
        });

        if (existingReport) {
            throw new ConflictException('You have already submitted a report for today');
        }

        const report = this.reportsRepository.create({
            ...reportData,
            author: userData,
            reportDate: today,
        });

        return this.reportsRepository.save(report);
    }

    async findAllDailyReports(user: User): Promise<Report[]> {
        if (user.role === 'admin') {
            return this.reportsRepository.find({ relations: ['author'] });
        }
        return this.reportsRepository.find({
            where: { author: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    // Anonymous Reports
    async createAnonymousReport(reportData: Partial<AnonymousReport>): Promise<AnonymousReport> {
        const report = this.anonymousReportsRepository.create(reportData);
        return this.anonymousReportsRepository.save(report);
    }

    async findAllAnonymousReports(): Promise<AnonymousReport[]> {
        return this.anonymousReportsRepository.find({ order: { createdAt: 'DESC' } });
    }
}
