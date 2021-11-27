import { 
  VendureEntity, 
  Customer, 
  ID,
} from "@vendure/core";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type ExtendedCustomer = Customer & {
  shortDescription: String;
};
