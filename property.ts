import "reflect-metadata"

const propertyMetadataKey = Symbol("property");

export const property = (target, propertyKey) => {
    var properties = Reflect.getOwnMetadata(propertyMetadataKey, target) || []
    properties.push(propertyKey)
    Reflect.defineMetadata(propertyMetadataKey, properties, target)
}