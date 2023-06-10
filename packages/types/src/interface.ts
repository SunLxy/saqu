type OmitPartial<T, K extends keyof T> = {
  [key in K]?: T[key];
};

type OmitExclude<T, K extends keyof T> = {
  [key in Exclude<keyof T, K>]: T[key];
};

/**两种类型 交叉*/
export type OmitKey<T, K extends keyof T> = OmitPartial<T, K> & OmitExclude<T, K>;
