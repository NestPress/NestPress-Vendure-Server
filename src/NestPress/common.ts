import { SortOrder } from "@vendure/core";

export interface GetListArgs<T> {
    query?: string
    limit? :number
    offset?: number
    filter?: T
    sort?: Record<string, SortOrder>
}

export interface ListFiltersOperators<T> {
    eq?: T
    notEq?: T
    contains?: T
    notContains?: T
    in?: T[]
    notIn?: T[]
    regex?: T 
}