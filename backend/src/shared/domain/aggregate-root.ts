import { Entity } from './entity';
import { IDomainEvent } from './domain-event';
import { DomainEvent } from './domain-event';
import { UniqueEntityID } from './unique-entity-id';
import { IBusinessRule } from './business-rule';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
    // Add this aggregate instance to the domain event's list of aggregates who's
    // events it eventually needs to dispatch.
    DomainEvent.markAggregateForDispatch(this);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  public CheckBusinessRule(rule: IBusinessRule): Boolean {
    return rule.isValid();
  }
}
