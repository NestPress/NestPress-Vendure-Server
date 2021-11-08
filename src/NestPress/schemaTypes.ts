import {
  SortOrder,
  DateOperators,
  NumberOperators,
  StringOperators,
  ID,
  BooleanOperators,
} from "@vendure/core";

export type VendureNode = {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
};

type AggregateType = "SUM" | "MIN" | "MAX" | "AVG" | "COUNT";

export type AggregateArgs = {
  aggregateType: AggregateType;
  field: string;
};

export type AggregateListArgs = { aggregates: AggregateArgs[] };

export type IDOperators = StringOperators;
