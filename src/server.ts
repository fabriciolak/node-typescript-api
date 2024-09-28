import './util/module-alias';

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import * as database from '@src/database'
import { ForecastController } from '@src/controllers/forecast';
import { BeachesController } from '@src/controllers/beaches';
import { UsersController } from '@src/controllers/users';
import dotenv from 'dotenv'

dotenv.config()

export class SetupServer extends Server {
  constructor(private port = process.env.PORT || 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupController();
    await this.databaseSetup();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening on port: ', this.port);
    })
  }

  public getApp(): Application {
    return this.app;
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private async databaseSetup(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  private setupController(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController()
    this.addControllers([
      forecastController,
      beachesController,
      usersController
    ]);
  }
}
