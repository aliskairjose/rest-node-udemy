import jwt from 'jsonwebtoken'

export const generateJWT = (uid = '') => {

  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
      expiresIn: 3600
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject('No se pudo generar el token')
      } else {
        resolve(token)
      }
    })
  })

}