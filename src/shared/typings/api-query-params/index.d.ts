// TODO: maybe utilize apq again

// declare module "api-query-params" {
//   import { FilterQuery } from "mongoose";
//   import { ParsedQs } from "qs";

//   /**
//    * @description object for advanced options [optional]
//    * @export
//    * @interface ApiQueryParamsOptions
//    * @template T
//    */
//   export interface ApiQueryParamsOptions<T> {
//     /**
//      * @description custom skip operator key (default is skip)
//      * @type {string}
//      * @memberof ApiQueryParamsOptions
//      */
//     skipKey?: string;
//     /**
//      * @description custom limit operator key (default is limit)
//      * @type {string}
//      * @memberof ApiQueryParamsOptions
//      */
//     limitKey?: string;
//     /**
//      * @description custom projection operator key (default is fields)
//      * @type {string}
//      * @memberof ApiQueryParamsOptions
//      */
//     projectionKey?: string;
//     /**
//      * @description custom sort operator key (default is sort)
//      * @type {string}
//      * @memberof ApiQueryParamsOptions
//      */
//     sortKey?: string;
//     /**
//      * @description custom filter operator key (default is filter)
//      * @type {string}
//      * @memberof ApiQueryParamsOptions
//      */
//     filterKey?: string;
//     /**
//      * @description custom populate operator key (default is populate)
//      * @type {string}
//      * @memberof ApiQueryParamsOptions
//      */
//     populationKey?: string;
//     /**
//      * @description filter on all keys except the ones specified
//      * @type {((keyof T)[] | string[])}
//      * @memberof ApiQueryParamsOptions
//      */
//     blacklist?: (keyof T)[] | string[];
//     /**
//      * @description filter only on the keys specified
//      * @type {((keyof T)[] | string[])}
//      * @memberof ApiQueryParamsOptions
//      */
//     whitelist?: (keyof T)[] | string[];
//     /**
//      * @description object to specify custom casters, key is the caster name, and value is a function which is passed the query parameter value as parameter.
//      * @type {Record<string,}
//      * @memberof ApiQueryParamsOptions
//      */
//     casters?: Record<string, (string) => any>;
//     /**
//      * @description object which map keys to casters (built-in or custom ones using the casters option).
//      * @type {(Record<keyof T | string, string>)}
//      * @memberof ApiQueryParamsOptions
//      */
//     castParams?: Record<keyof T | string, string>;
//   }

//   /**
//    * @description The resulting object contains the following properties:
//    * @export
//    * @interface ApiQuery
//    * @template T
//    */
//   export interface ApiQuery<T> {
//     /**
//      * @description contains the query criteria
//      * @type {FilterQuery<T>}
//      * @memberof ApiQuery
//      */
//     filter: FilterQuery<T>;
//     /**
//      * @description contains the query projection
//      * @type {(string | any)}
//      * @memberof ApiQuery
//      */
//     projection: string | any;
//     /**
//      * @description contains the cursor modifiers
//      * @type {(string | any)}
//      * @memberof ApiQuery
//      */
//     sort: string | any;
//     /**
//      * @description contains the cursor modifiers
//      * @type {number}
//      * @memberof ApiQuery
//      */
//     skip: number;
//     /**
//      * @description contains the cursor modifiers
//      * @type {number}
//      * @memberof ApiQuery
//      */
//     limit: number;
//     /**
//      * @description contains the query population (mongoose feature only)
//      * @type {(string | any)}
//      * @memberof ApiQuery
//      */
//     population: string | any;
//   }

//   /**
//    * @description Convert query parameters from API urls to MongoDB queries (advanced querying, filtering, sorting, …)
//    * @export
//    * @template T
//    * @param {(string | ParsedQs)} query query string part of the requested API URL (ie, firstName=John&limit=10). Works with already parsed object too (ie, {status: 'success'}) [required]
//    * @param {ApiQueryParamsOptions<T>} [options] object for advanced options [optional]
//    * @returns {*}  {ApiQuery<T>}
//    */
//   function aqp<T>(
//     query: string | ParsedQs,
//     options?: ApiQueryParamsOptions<T>
//   ): ApiQuery<T>;

//   export default aqp;
// }
