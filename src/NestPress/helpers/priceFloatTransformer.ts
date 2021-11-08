import { ValueTransformer } from "typeorm";

export const priceFloatTransformer: ValueTransformer = {
  from: (v) => v,
  to: (v=0) => Number(v).toFixed(2),
};
