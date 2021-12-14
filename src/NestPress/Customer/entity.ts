import { 
  VendureEntity, 
  Customer, 
  ID,
} from "@vendure/core";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GetListArgs, ListFiltersOperators } from "../common";

export type CustomerInput = {
  parentId: string;
  block: string;
  post?: string;
  attrs: any;
};

export type CustomerFilter = {
  post?: ListFiltersOperators<string>;
  parentId?: ListFiltersOperators<string>;
};

export type GetCustomersArgs = GetListArgs<CustomerFilter>;

export type ExtendedCustomer = Customer & {
  shortDescription: String;
};
