import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleVerify (token = '') {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const { name, picture, email } = payload
  const userid = payload['sub'];

  // Se cambia picture a img por el modelo de usuario
  return {
    name,
    img: picture,
    email
  }

  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
// verify().catch(console.error);