import { Document } from 'mongoose';

export enum MigrationState {
  Down = 'down',
  Up = 'up',
}

export interface IMigration extends Document {
  readonly name: string;
  readonly createdAt: Date;
  readonly state: MigrationState;
  readonly filename: string;
}
