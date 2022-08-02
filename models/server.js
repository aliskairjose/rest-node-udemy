import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { User } from '../routes/user.route.js';
import { dbConnection } from '../database/config.js';
import { AuthRoute } from '../routes/auth.route.js';
import { CategoryRoute } from '../routes/category.route.js';
import { ProductRoute } from '../routes/product.route.js';
import { SearchRoute } from '../routes/search.route.js';
import { UploadRoute } from '../routes/upload.route.js';
import fileUpload from 'express-fileupload';

if (process.env.NODE_ENV !== 'production') dotenv.config();

export class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.user = new User()
    this.authRoute = new AuthRoute()
    this.catRoute = new CategoryRoute()
    this.productRoute = new ProductRoute()
    this.searchRoute = new SearchRoute()
    this.uploadRute = new UploadRoute

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
    this.app.use('/api/categories', this.catRoute.router)
    this.app.use('/api/products', this.productRoute.router)
    this.app.use('/api/search', this.searchRoute.router)
    this.app.use('/api/uploads', this.uploadRute.router)
  }

  middlewares () {
    // CORS
    this.app.use(cors())

    // Lectura y parseo del body POST
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'))

    // Note that this option available for versions 1.0.0 and newer. 
    // File Uploads
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))
  }

  async dbConn () {
    await dbConnection()
  }
}