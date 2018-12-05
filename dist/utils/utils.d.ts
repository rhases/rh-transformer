export declare function getValue(data: any, field: any, from: any): any;
export declare function setAction(fields: any, toTransport: any, fromData: any, toData: any, params: any): void;
/**
 *  Get id from the origin (update with remote reference)
 */
export declare function getIdFrom(fields: any, fromData: any, params: any): any;
/**
 *  Get id from the destination (case of a update with local reference)
 */
export declare function getIdTo(fields: any, toData: any, params: any): any;
export declare function diff(curr: any, last: any): any;
export declare function clearNotUpdatableFields(fields: any, toTransport: any, params: any): void;
export declare function setNoupIfRequiredFieldNotSet(fields: any, toTransport: any, params: any): any;
export declare function setNoupIfEmpty(toTransport: any): any;
