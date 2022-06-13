declare module "mongoose" {
  interface DocumentQuery<
    T,
    DocType extends import("mongoose").Document,
    QueryHelpers = {}
  > {
    mongooseCollection: {
      name: any;
    };
    cache(options?: any): Query<ResultType, DocType, any, DocType>;
    useCache: boolean;
    hashKey: string;
  }

  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType>
    extends DocumentQuery<any, any> {}
}

type CacheOptions = {
  key?: string;
}