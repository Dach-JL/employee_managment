import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum TaskStatus {
    PENDING = 'pending',
    ASSIGNED = 'assigned',
    IN_PROGRESS = 'in_progress',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'simple-enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column({
        type: 'simple-enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: TaskStatus;

    @Column({ type: 'datetime', nullable: true })
    deadline: Date;

    @ManyToOne(() => User, { nullable: true })
    assignee: User;

    @Column({ nullable: true })
    rejectionReason: string;

    @Column('simple-json', { nullable: true })
    attachments: { name: string; url: string; size: number; type: string }[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
