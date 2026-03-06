import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('daily')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit a daily report' })
    submitDailyReport(@Request() req, @Body() reportData: any) {
        return this.reportsService.createDailyReport(req.user, reportData);
    }

    @UseGuards(JwtAuthGuard)
    @Get('daily')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get daily reports (Admin views all, Employee views own)' })
    getDailyReports(@Request() req) {
        return this.reportsService.findAllDailyReports(req.user);
    }

    @Post('anonymous')
    @ApiOperation({ summary: 'Submit an anonymous report (Public)' })
    submitAnonymousReport(@Body() reportData: any) {
        return this.reportsService.createAnonymousReport(reportData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('anonymous')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all anonymous reports (Admin only)' })
    getAnonymousReports() {
        return this.reportsService.findAllAnonymousReports();
    }
}
