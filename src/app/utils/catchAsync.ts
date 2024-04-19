import { NextFunction, Request, RequestHandler, Response } from "express";

//making a common function for all to accept error

const catchAsync = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err))
    }
}

export default catchAsync;