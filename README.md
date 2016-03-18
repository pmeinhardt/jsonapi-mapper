# JSON API Mapper [![Build Status](https://travis-ci.org/scoutforpets/jsonapi-mapper.svg?branch=master)](https://travis-ci.org/scoutforpets/jsonapi-mapper)
JSON API Mapper (_formerly Oh My JSON API_) is a wrapper around [@Seyz](https://github.com/SeyZ/)'s excellent [JSON API](http://jsonapi.org/)-compliant serializer, [jsonapi-serializer](https://github.com/SeyZ/jsonapi-serializer), that removes the pain of generating the necessary options needed to serialize each of your ORM models.

[![Join the chat at https://gitter.im/scoutforpets/oh-my-jsonapi](https://badges.gitter.im/scoutforpets/oh-my-jsonapi.svg)](https://gitter.im/scoutforpets/oh-my-jsonapi?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## _Breaking Changes_
This project has recently been renamed and rewritten using Typescript. While most functionality is generally the same, there have been a few deprecations and changes to how the Mapper is initialized. Please see the [migration guide](#migrating-from-ohmyjsonapi) below.

## How does it work?
A serializer requires some sort of 'template' to understand how to convert what you're passing in to whatever you want to come out. When you're dealing with an ORM, such as [Bookshelf](https://github.com/tgriesser/bookshelf), it would be a real pain to have to generate the 'template' for every one of your Bookshelf models in order to convert them to JSON API. JSON API Mapper handles this by dynamically analyzing your models and automatically generating the necessary 'template' to pass to the serializer.

## What ORMs do you support?
Initially, we only provide a mapper for [Bookshelf](https://github.com/tgriesser/bookshelf). However, the library can be easily extended with new mappers to support other ORMs. PR's are more than welcome!

## How do I install it?
`npm install jsonapi-mapper --save`

## How do I use it?
It's pretty simple. You only need to configure the mapper and then use it as many times you need.

```javascript
import Mapper = require('jsonapi-mapper');

// Create the mapper
var mapper = new Mapper.Bookshelf('https://api.hotapp.com');

// Use the mapper to output JSON API-compliant using your ORM-provided data
return mapper.map(myData, 'appointment');
```

## Migrating from OhMyJSONAPI
The migration process is painless:
- Remove `oh-my-jsonapi` from your project.
- Run `npm install jsonapi-mapper --save`
- Convert any instances of the constructor:

  ```javascript
  new OhMyJSONAPI('bookshelf', 'https://api.hotapp.com');
  ```
  
  to

  ```javascript
  new Mapper.Bookshelf('https://api.hotapp.com');
  ```
- Convert any instances of:

  ```javascript
  jsonApi.toJSONAPI(myData, 'appointment');
  ```

  to

  ```javascript
  mapper.map(myData, 'appointment');
  ```

## API
```javascript
new Mapper.Bookshelf(baseUrl, serializerOptions)
```
- _(optional)_ `baseUrl` _(string)_: the base URL to be used in all `links` objects returned.
- _(optional)_ `serializerOptions` _(string)_: options to be passed to the serializer. These options will override any options generated by the mapper. For more information on the raw serializer, please [see the documentation here](https://github.com/SeyZ/jsonapi-serializer#documentation).

```javascript
mapper#map(data, type, mapperOptions)
```
- `data` _(object)_: the data object from Bookshelf (either a Model or a Collection) to be serialized.
- `type` _(string)_: the type of the resource being returned. For example, if you passed in an `Appointment` model, your `type` might be `appointment`.
- _(optional)_ `mapperOptions` _(object)_:
  - _(optional)_ `relations` _(boolean | string[])_: flag to disable serializing related models on the response. Alternatively, you can provide a string array to indicate the specific relations you want to serialize. By default, all relations loaded on the model are serialized (true).
  - _(optional)_ `includeRelations` _(boolean | string[])_ (deprecated): alias option of relations option.
  - _(optional)_ `query` _(object)_: an object containing the original query parameters. these will be appended to `self` and pagination links. Developer Note: this is not fully implemented yet, but following releases will fix that.*
  - _(optional)_ `pagination` _(object)_: pagination-related parameters for building pagination links for collections.
    - _(required)_ `offset` _(integer)_
    - _(required)_ `limit` _(integer)_
    - _(optional)_ `total` _(integer)_

# How can I contribute?
The project is very open to collaboration from the public, especially on providing the groundwork for other ORM's (like [Sequelize](http://docs.sequelizejs.com/) or [Mongoose](http://mongoosejs.com/)). Just open a PR!

The project source has been recently rewritten using [Typescript](http://www.typescriptlang.org/), which has been proven useful for static checks and overall development.

# Credits
- Thanks to [@Seyz](https://github.com/SeyZ/). Without his work, the project would not be possible.
- Thanks to the [ZOI Travel team](https://github.com/zoitravel) (especially [@ShadowManu](https://github.com/shadowmanu)) for their hard work in migrating the codebase to Typescript and writing a comprehensive test suite.
