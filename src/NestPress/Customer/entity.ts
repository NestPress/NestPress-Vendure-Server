import { 
  VendureEntity, 
  Customer, 
  ID,
} from "@vendure/core";

export type ExtendedCustomer = Customer & {
  shortDescription: String;
};



