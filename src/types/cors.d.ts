import { RequestHandler } from 'express';

declare function cors(options?: any): RequestHandler;

export = cors;
