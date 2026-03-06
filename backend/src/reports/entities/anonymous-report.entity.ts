import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('anonymous_reports')
export class AnonymousReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category: string; // e.g., "Harassment", "Suggestion", "Bug"

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
