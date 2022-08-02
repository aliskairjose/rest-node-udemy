import { v4 as uuidv4 } from "uuid";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exts = ['png', 'jpg', 'gif']

export const uploadFile = ({ files, allowedExtensions = exts, folder = '' }) => {

  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const customeName = archivo.name.split('.')
    const [ext] = customeName.slice(-1) // Extraemos el ultimo elemento del array

    if (!allowedExtensions.includes(ext)) {
      reject(`La extension ${ext} no esta dentro de las permitidas, user alguna de estas: ${allowedExtensions}`)
    }

    const tempName = `${uuidv4()}.${ext}`
    const uploadPath = path.join(__dirname, '../uploads/', folder, tempName)

    archivo.mv(uploadPath, (err) => {
      if (err) { reject(err) }
      resolve({ tempName, path: `/uploads/${folder}/` })
    });

  })
}