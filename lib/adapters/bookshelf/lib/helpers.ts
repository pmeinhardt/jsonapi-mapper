import {Model as BModel, Collection as BCollection} from 'bookshelf';
import * as inflection from 'inflection';
import * as serializer from 'jsonapi-serializer';

'use strict';

// Using internally defined properties
class Model extends BModel<any> {
  attributes: any;
}

// Using internally defined properties
class Collection extends BCollection<any> {
  models: Model[];
  length: number;
}

export function buildSelfLink(baseUrl, modelType, queryParams) {
  return {
    self: function(model: any, related: any): string {

      let link: string = baseUrl + '/' +
        inflection.pluralize(modelType);

      // TODO CHECK LOGIC BEHIND
      // If an id was specified
      if (model && model.id) {
        return link + '/' + model.id;

      } else if (model) {
        return null;

      } else {
        return link;
      }
    }
  };
}

/**
 * Builds the relationship transform schema
 * @param baseUrl
 * @param relationType
 * @param relationKeys
 * @param modelType
 * @param included
 * @returns serializer.ISerializerOptions
 */
export function buildRelation(baseUrl: string,
                              relationType: string,
                              relationKeys: string[],
                              modelType: string,
                              included: boolean)
                              : serializer.ISerializerOptions {

  // Pluralize the relation and model types to conform with the spec
  relationType = inflection.pluralize(relationType);
  modelType = inflection.pluralize(modelType);

  let baseRelationUrl: string = baseUrl + '/' + modelType + '/';

  return {
    ref: 'id',
    attributes: relationKeys,
    relationshipLinks: {
      self: function(model: any, related: any): string {
        return baseRelationUrl + model.id +
          '/relationships/' + relationType;
      },
      related: function(model: any, related: any): string {
        return baseRelationUrl + model.id +
          '/' + relationType;
      }
    },
    includedLinks: {
      self: function(model: any, related: any): string {
        return baseUrl + '/' + relationType + '/' + related.id;
      }
    },
    included: included
  };
}

/**
 * Retrieves a relation's attributes depending on the
 * type of relationship (one, many)
 * @param data
 * @returns {any}
 * @private
 */
export function getRelationAttributes(data: Model | Collection): any {
  let m: Model = <Model>data;
  let c: Collection = <Collection> data;

  // Data as Model
  if (m instanceof BModel) {
    return m.attributes;

  // Data as Collection
  } else if (c instanceof BCollection) {
    return c.models[0].attributes;
  }
}

/**
 * Determines wether a Bookshelf object's data is empty
 * @param data
 * @returns {boolean}
 */
export function isDataEmpty(data: Model | Collection): boolean {
  return (<Model>data).attributes === undefined &&
    ((<Collection>data).models === undefined || (<Collection>data).length === 0);
}

/**
 * Determine whether a Bookshelf object is a Collection.
 * @param data
 * @returns {boolean}
 */
export function isCollection(data: any): boolean {
  return data.models !== undefined;
}
