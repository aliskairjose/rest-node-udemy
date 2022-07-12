import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../routes/user.route.js';
import { dbConnection } from '../database/config.js';
import { AuthRoute } from '../routes/auth.route.js';

if (process.env.NODE_ENV !== 'production') dotenv.config();

export class Server {


  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.user = new User()
    this.authRoute = new AuthRoute()

    // Connect to DB
    this.dbConn()

    // Middlewares
    this.middlewares()

    // App routes
    this.routes();
  }

  init () {
    this.app.listen(this.port, () => console.log(`Escuchando por el puerto: ${this.port}`))
  }

  routes () {
    this.app.use('/api/auth', this.authRoute.router)
    this.app.use('/api/user', this.user.router)
  }

  middlewares () {
    // CORS
    this.app.use(cors())

    // Lectura y parseo del body POST
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'))
  }

  async dbConn () {
    await dbConnection()
  }
}