import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('overview')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get system-wide overview stats (Admin only)' })
    async getOverview() {
        return this.analyticsService.getSystemOverview();
    }

    @Get('tasks')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get task distribution stats' })
    async getTaskStats() {
        return this.analyticsService.getTaskStats();
    }

    @Get('priorities')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get task priority stats' })
    async getPriorityStats() {
        return this.analyticsService.getPriorityStats();
    }

    @Get('activity')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get recent system activity (Admin only)' })
    async getActivity() {
        return this.analyticsService.getRecentActivity();
    }
}
