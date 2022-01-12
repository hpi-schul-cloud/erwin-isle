export class EntityNotFoundException extends Error {
    public constructor(entityName?: string) {
        entityName = entityName ?? 'Entity';

        super(`${entityName} not found.`);
        Object.setPrototypeOf(this, EntityNotFoundException.prototype);
    }
}
