import mongoose from 'mongoose'
import { Controller, ClassMiddleware, Post } from "@overnightjs/core";
import { Beach } from "@src/models/beach";
import { Request, Response } from "express";
import { authMiddleware } from '@src/middlewares/auth';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response) {
    try {
      const beach = new Beach({
        ...req.body,
        ...{
          user: req.decoded?.id
        }
      })
      const result = await beach.save()

      res.status(201).send(result)
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message })
      } else {
        res.status(500).send({ error: 'Internal server error' })
      }
    }
  }
}