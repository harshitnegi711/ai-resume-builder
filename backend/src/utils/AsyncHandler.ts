import type { NextFunction, Request, Response } from "express"

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

export const AsyncHandler = (asyncFunc: AsyncFunction) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await asyncFunc(req, res, next)

  } catch (error) {
    console.log("Something went wrong -----> ", error)
    next(error)
  }

}
