import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';
import { Role } from './users/enums/role.enum';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) { }

  async onModuleInit() {
    const adminEmail = 'admin@company.com';
    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      console.log('Seeding initial admin user...');
      await this.usersService.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: Role.ADMIN,
        department: 'IT',
        position: 'Administrator',
      });
      console.log('Initial admin user created: admin@company.com / AdminPassword123!');
    }
  }

  getHello(): string {
    return 'Workforce API is running!';
  }
}
