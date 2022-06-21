export const Config = {
  port: parseInt(process.env.PORT || '8080'),
  usersSheet: process.env.USERS_SHEET,
  privateKey: JSON.parse(process.env.GENERAL_PRIVATE_KEY || '').privateKey,
  clientEmail: process.env.GENERAL_CLIENT_EMAIL || '',
}
