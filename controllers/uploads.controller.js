import { request, response } from "express";
import { uploadFile } from "../helpers/upload-file.js";
import User from '../models/user.js'
import Product from '../models/product.model.js'
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class UploadController {
  constructor() { }


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
}