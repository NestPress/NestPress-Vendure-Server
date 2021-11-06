# vendure with docker starter pack

This project was generated with [`@vendure/create`](https://github.com/vendure-ecommerce/vendure/tree/master/packages/create).

## First Setup

* `/src/vendure-config.ts` change dbConnectionOptions
* `/docker-compose.yaml` change db:environment:
* `/src/vendure-config.ts` import plugin


## Directory structure

* `/src` contains the source code of your Vendure server. All your custom code and plugins should reside here.
* `/static` contains static (non-code) files such as assets (e.g. uploaded images) and email templates.

## Development

```
yarn start
# or
npm run start
```

will start the Vendure server and [worker](https://www.vendure.io/docs/developer-guide/vendure-worker/) processes from
the `src` directory.

## Working with app

`http://localhost:3000/admin-api`

## Build

```
yarn build
# or
npm run build
```

will compile the TypeScript sources into the `/dist` directory.

## Migrations

[Migrations](https://www.vendure.io/docs/developer-guide/migrations/) allow safe updates to the database schema.

The following npm scripts can be used to generate migrations:

```
yarn migration:generate [name]
# or
npm run migration:generate [name]
```

run any pending migrations that have been generated:

```
yarn migration:run
# or
npm run migration:run
```

and revert the most recently-applied migration:

```
yarn migration:revert
# or
npm run migration:revert
```

#RES
https://github.com/drewterry/vendure-favorites-plugin#readme
https://giters.com/c0ldfront/stripe-vendure-plugin
braitree and reviews
https://codesandbox.io/s/hibzn
https://cnpmjs.org/package/vendure-plugin-google-storage-assets/v/1.1.0
https://openbase.com/js/vendure-product-recommendations/documentation
https://developer.aliyun.com/mirror/npm/package/vendure-bulk-discounts/v/0.1.1
https://changestack.io/changes/npm-dc188c9b-vendurepayments-plugin/
dutch postalcode
https://github.com/martijnvdbrug/pinelab-vendure-plugins
some stff
https://npmmirror.com/~michaelbromley
https://gitmemory.com/issue/vendure-ecommerce/vendure/215/566095591
