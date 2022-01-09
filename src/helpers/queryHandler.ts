import { QueryOptions } from "mongoose";
import regexp from "../helpers/escapeRegex";

interface IParams {
  populate?: Array<{ path: string; select?: string }>;
  search?: string;
  limit?: number;
  page?: number;
  sort?: Object;
  order?: string;
}

/**
 * Handling request query
 * @constructor
 * @param {IParams} query Valid User Query Request (e.g: search, limit, page, sort, etc)
 * @param {string} override Override query search field [default: 'name']
 */
export default (query: IParams, override?: string, callback?: () => void) => {
  let filter: Object = {};
  let options: QueryOptions = {};

  if (query.search) {
    const $regex = new RegExp(regexp(query.search as string), "i");
    filter = { ...filter, [override || "name"]: { $regex } };
  }
  if (query.limit) {
    options.limit = +query.limit;
  }
  if (query.page) {
    options = { ...options, skip: (+query.page - 1) * +options.limit };
  }
  if (query.populate) {
    options = { ...options, populate: query.populate };
  }
  if (query.sort) {
    options.sort = { [query.sort.toString()]: query.order || "asc" };
  }

  typeof callback !== "undefined" && callback();

  return { filter, options };
};
