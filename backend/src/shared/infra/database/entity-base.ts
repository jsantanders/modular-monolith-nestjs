import { PrimaryGeneratedColumn } from 'typeorm';

export class EntityBaseRaw {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
