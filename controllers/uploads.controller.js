import { request, response } from "express";
import { uploadFile } from "../helpers/upload-file.js";
import User from '../models/user.js'
import Product from '../models/product.model.js'
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class UploadController {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    })
  }

  uploadFile = async (req = request, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({ msg: 'No files were uploaded.' });
      return;
    }
    if (!req.files.archivo || Object.keys(req.files).length === 0) {
      res.status(400).json({ msg: 'No files were uploaded.' });
      return;
    }

    try {
      const file = await uploadFile({ files: req.files, folder: 'pruebas', allowedExtensions: ['txt', 'md'] })

      res.json({
        msg: 'Archivo cargado correctamente',
        body: file
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({ msg: error })
    }

  }

  updateImage = async (req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({ msg: 'No files were uploaded.' });
      return;
    }
    if (!req.files.archivo || Object.keys(req.files).length === 0) {
      res.status(400).json({ msg: 'No files were uploaded.' });
      return;
    }
    const { id, collection } = req.params
    let model

    switch (collection) {
      case 'users':
        model = await User.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe el usuario con id ${id}`
          })
        }
        break;
      case 'products':
        model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe el producto con id ${id}`
          })
        }
        break;

      default:
        return res.status(500).json({
          msg: 'Funcionalidad pendiente'
        })
        break;
    }

    // Limpiar imagenes previas
    try {
      if (model.img) {
        // Hay que borrar la imagen del server
        const imagePath = path.join(__dirname, '../uploads', collection, model.img)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }
    } catch (error) {
      console.error(error)
      throw new Error('Ha ocurrido un error, contacte con el administrador')
    }

    const { tempName } = await uploadFile({ files: req.files, folder: collection })

    model.img = tempName
    await model.save()

    res.json({
      body: model,
      msg: `Se ha actualizado la image de ${collection}`
    })
  }

  uploadCloudinary = async (req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({ msg: 'No files were uploaded.' });
      return;
    }
    if (!req.files.archivo || Object.keys(req.files).length === 0) {
      res.status(400).json({ msg: 'No files were uploaded.' });
      return;
    }
    const { id, collection } = req.params
    let model

    switch (collection) {
      case 'users':
        model = await User.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe el usuario con id ${id}`
          })
        }
        break;
      case 'products':
        model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe el producto con id ${id}`
          })
        }
        break;

      default:
        return res.status(500).json({
          msg: 'Funcionalidad pendiente'
        })
        break;
    }

    // Limpiar imagenes previas
    try {
      if (model.img) {
        // Hay que borrar la imagen de cloudinary
        const nameArr = model.img.split('/')
        const name = nameArr.slice(-1)
        const [public_id] = name.toString().split('.')
        cloudinary.uploader.destroy(public_id)
      }

      const { tempFilePath } = req.files.archivo
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
      model.img = secure_url
      await model.save()
      res.json({
        body: model,
        msg: `Se ha actualizado la image de ${collection}`
      })
    } catch (error) {
      console.error(error)
      throw new Error('Ha ocurrido un error, contacte con el administrador')
    }

  }

  showImage = async (req = request, res = response) => {
    const { id, collection } = req.params
    let model

    switch (collection) {
      case 'users':
        model = await User.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe el usuario con id ${id}`
          })
        }
        break;
      case 'products':
        model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe el producto con id ${id}`
          })
        }
        break;

      default:
        return res.status(500).json({
          msg: `La Coleccion ${collection} no existe o no esta permitida`
        })
    }

    try {
      if (model.img) {
        // Hay que borrar la imagen del server
        const imagePath = path.join(__dirname, '../uploads', collection, model.img)
        if (fs.existsSync(imagePath)) {
          res.sendFile(imagePath)
          return
        }
      }
    } catch (error) {
      console.error(error)
      throw new Error('Ha ocurrido un error, contacte con el administrador')
    }

    const placeholder = path.join(__dirname, '../assets', 'no-image.jpg');
    if (fs.existsSync(placeholder)) {
      res.sendFile(placeholder)
      return
    }


    res.json({
      body: model,
      msg: `Falta placeholder`
    })
  }


}