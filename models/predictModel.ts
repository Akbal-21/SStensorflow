import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Prediction extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// @Column("text")
	// srcImg: string;

	@Column()
	predict: string;
}
