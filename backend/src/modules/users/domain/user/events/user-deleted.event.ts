import { IDomainEvent, UniqueEntityID } from 'shared/domain';
import { User } from "../user.aggregate";

export class UserDeleted implements IDomainEvent {
    public dateTimeOccurred: Date;
    public user: User;
  
    constructor (user: User) {
      this.dateTimeOccurred = new Date();
      this.user = user;
    }
    
    getAggregateId (): UniqueEntityID {
      return this.user.id;
    }
  }
