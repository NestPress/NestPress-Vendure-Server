import { SelectQueryBuilder, ObjectType } from "typeorm";
import {
  RequestContext,
  TransactionalConnection,
  FilterParameter,
  SortParameter,
} from "@vendure/core";
import { parseFilterParams } from "@vendure/core/dist/service/helpers/list-query-builder/parse-filter-params";
import { parseSortParams } from "@vendure/core/dist/service/helpers/list-query-builder/parse-sort-params";
import { getColumnMetadata } from "@vendure/core/dist/service/helpers/list-query-builder/connection-utils";
import { Type } from "@vendure/common/lib/shared-types";

import { AggregateArgs, AggregateListArgs } from "./schemaTypes";
import { flatten, flattenObject } from "./helpers";
import "../types";

type FullTextSearchFields<T = any> = {
  fields?: ConvertDeep<Partial<T>, boolean>;
  relationFields?: ConvertDeepWithoutArray<Partial<T>, boolean>;
};

type QueryOptions<T> = Partial<{
  withSort: boolean;
  withFilters: boolean;
  withPagination: boolean;
  withFullTextSearch: boolean | FullTextSearchFields<T>;
}>;

export type ListWithItems<T> = { list: T[]; totalItems: number };

export type AdvancedQueryResult<
  T = any,
  FILTERS extends FilterParameter<any> = {}
> = (
  ctx: RequestContext,
  args: {
    limit?: number;
    offset?: number;
    filter?: FILTERS;
    sort?: SortParameter<any>;
    query?: string;
  } & Partial<AggregateArgs | AggregateListArgs>
) => {
  getQuery: (queryOptions?: QueryOptions<T>) => SelectQueryBuilder<T>;
  getAggregation: (qb?: SelectQueryBuilder<T>) => Promise<any>;
  getListWithCount: (qb?: SelectQueryBuilder<T>) => Promise<ListWithItems<T>>;
};

export type AdvancedQueryArgs<T, FILTERS> = {
  connection: TransactionalConnection;
  entity: Type<T>;
  relations: (keyof OnlyComplexProperties<T>)[];
  fullTextSearch: FullTextSearchFields<T>;
  customFilterPropertyMap?: Partial<
    Record<keyof Omit<FILTERS, keyof T>, string>
  >;
};

// export withListCount = <T>(: qb?: SelectQueryBuilder<T>)

// if nested path - `products.product.category` -> `product.category`
const getRelationPath = (alias: string, path: string): [string, string] => {
  const pathSplitted = path.split(".");
  const countSplits = pathSplitted.length;
  const relationPath =
    countSplits > 1
      ? countSplits > 2
        ? `${pathSplitted[countSplits - 2]}.${pathSplitted[countSplits - 1]}`
        : path
      : `${alias}.${path}`;

  const relationName = countSplits > 1 ? pathSplitted[countSplits - 1] : path;

  return [relationPath, relationName];
};

const getQueryBuilder = <T = any>(
  connection: TransactionalConnection,
  ctx: RequestContext,
  schema: ObjectType<T>,
  alias: string,
  relations: (keyof OnlyComplexProperties<T>)[] = []
) =>
  (relations as string[]).reduce(
    (acc, curr) => acc.leftJoinAndSelect(...getRelationPath(alias, curr)),
    connection.getRepository(ctx, schema).createQueryBuilder(alias)
  );

// ts_rank_cd(to_tsvector(coalesce(concat_ws(' ', operation, place, client),'')), plainto_tsquery(:query))
// const withFullTextSearch = <T>(
//   queryBuilder: SelectQueryBuilder<T>,
//   args: { query?: string },
//   alias: string,
//   fields: FullTextSearchFields<T>
// ) =>
//   args.query
//     ? queryBuilder
//         .addSelect(
//           `ts_rank_cd(to_tsvector(coalesce(concat_ws(' ', ${Object.keys(
//             flatten({
//               [alias]: fields.fields,
//               ...(fields.relationFields as object),
//             })
//           ).join(", ")}),'')), plainto_tsquery(:query))`,
//           "rank"
//         )
//         .setParameter("query", args.query)
//         .orderBy("rank", "DESC")
//     : queryBuilder;

// alternate full text search - uses LIKE operator
const withFullTextSearch = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  args: { query?: string },
  alias: string,
  fields: FullTextSearchFields<T>
) =>
  args.query
    ? queryBuilder.andWhere(
        `CONCAT(${Object.keys(
          flattenObject({
            [alias]: fields.fields,
            ...(fields.relationFields as object),
          })
        ).join(", ' ', ")}) LIKE :query`,
        { query: `%${args.query}%` }
      )
    : queryBuilder;

const withPagination = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  args: { limit?: number; offset?: number }
) => {
  if (args.limit) queryBuilder.limit(args.limit);
  if (args.offset) queryBuilder.offset(args.offset);

  return queryBuilder;
};

const withFilters = <T>(
  rawConnection: any,
  entity: any,
  queryBuilder: SelectQueryBuilder<T>,
  args: { limit?: number; offset?: number; filter?: any },
  customFilterPropertyMap?: any
) =>
  args.filter
    ? parseFilterParams(
        rawConnection,
        entity,
        args.filter,
        customFilterPropertyMap
      ).reduce(
        (acc, { clause, parameters }) => acc.andWhere(clause, parameters),
        queryBuilder
      )
    : queryBuilder;

const withSort = <T>(
  rawConnection: any,
  entity: any,
  queryBuilder: SelectQueryBuilder<T>,
  args: { limit?: number; offset?: number; sort?: any }
) =>
  args.sort
    ? queryBuilder.orderBy(
        parseSortParams(
          rawConnection,
          entity,
          args.sort
          // customPropertyMap,
        )
      )
    : queryBuilder;

const withAggregation = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  args: AggregateArgs | AggregateListArgs,
  alias: string
) =>
  "aggregates" in args
    ? args.aggregates
        .reduce(
          (acc, curr, i) =>
            acc[i === 0 ? "select" : "addSelect"](
              `${curr.aggregateType}(${alias}.${curr.field})`,
              curr.field
            ),
          queryBuilder
        )
        .getRawOne()
    : queryBuilder
        .select(`${args.aggregateType}(${alias}.${args.field})`, "aggregation")
        .getRawOne()
        .then((res) => res.aggregation);

export const listWithItems = <T>([list, totalItems]: [
  T[],
  number
]): ListWithItems<T> => ({
  list,
  totalItems,
});

export const createAdvancedQuery = <T = any, FILTERS = {}>({
  connection,
  entity,
  relations = [],
  fullTextSearch = {
    fields: {},
    relationFields: {},
  } as any,
  customFilterPropertyMap,
}: AdvancedQueryArgs<T, FILTERS>): AdvancedQueryResult<T> => {
  const { alias } = getColumnMetadata(connection.rawConnection, entity);

  const fnsMap = {
    withAggregation: (qb: SelectQueryBuilder<T>, args: any) =>
      withAggregation(qb, args, alias),
    withPagination: (qb: SelectQueryBuilder<T>, args: any) =>
      withPagination(qb, args),
    withSort: (qb: SelectQueryBuilder<T>, args: any) =>
      withSort(connection.rawConnection, entity, qb, args),
    withFilters: (qb: SelectQueryBuilder<T>, args: any) =>
      withFilters(
        connection.rawConnection,
        entity,
        qb,
        args,
        customFilterPropertyMap
      ),
    withFullTextSearch: (
      qb: SelectQueryBuilder<T>,
      args: any,
      fields = fullTextSearch
    ) => withFullTextSearch(qb, args, alias, fields),
  };

  return (ctx, args) => {
    const queryBuilder = getQueryBuilder(
      connection,
      ctx,
      entity,
      alias,
      relations
    );

    return {
      getAggregation: (qb = queryBuilder) => fnsMap.withAggregation(qb as any, args),
      getListWithCount: (qb = queryBuilder) =>
        qb.getManyAndCount().then(listWithItems),
      getQuery: (options = {}) =>
        Object.entries({
          withPagination: true,
          withFilters: true,
          withFullTextSearch: true,
          withSort: true,
          ...options,
        }).reduce(
          (acc: any, [k, v]) =>
            (v
              ? fnsMap[k as keyof QueryOptions<T>](
                  acc,
                  args,
                  typeof v === "boolean" ? undefined : v
                )
              : acc) as any,
          queryBuilder
        ),
    } as any;
  };
};
