import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @Column('simple-array', { nullable: true })
    tasksCompleted: string[]; // List of task IDs or titles

    @Column('text', { nullable: true })
    blockers: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    author: User;

    @Column({ type: 'date' })
    reportDate: string; // YYYY-MM-DD
}
