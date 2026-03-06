import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new user (Admin only)' })
    create(@Body() userData: Partial<User>) {
        return this.usersService.create(userData);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get('search')
    @ApiOperation({ summary: 'Search for colleagues' })
    search() {
        return this.usersService.findAllPublic();
    }

    @Patch('avatar')
    @ApiOperation({ summary: 'Update profile picture' })
    updateAvatar(@Request() req, @Body('avatarUrl') avatarUrl: string) {
        return this.usersService.updateAvatar(req.user.id, avatarUrl);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    update(@Param('id') id: string, @Body() updateData: Partial<User>) {
        return this.usersService.update(id, updateData);
    }

    @Post(':id/deactivate')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Deactivate a user (Admin only)' })
    deactivate(@Param('id') id: string) {
        return this.usersService.deactivate(id);
    }

    @Post(':id/reset-password')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Reset a user password (Admin only)' })
    resetPassword(@Param('id') id: string, @Body('newPassword') newPassword: string) {
        return this.usersService.resetPassword(id, newPassword);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Soft-delete a user (Admin only)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
