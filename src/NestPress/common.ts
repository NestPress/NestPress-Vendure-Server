export interface GetListArgs<T> {
    query?: string
    limit? :number
    offset?: number
    filter?: T
}

export interface ListFiltersOperators<T> {
    eq: T
    notEq: T
    contains: T
    notContains: T
    in: T[]
    notIn: T[]
    regex: T 
}