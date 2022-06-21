export const Config = {
  port: parseInt(process.env.PORT || '8080'),
  usersSheet: process.env.USERS_SHEET,
  privateKey: process.env.GENERAL_PRIVATE_KEY || '',
  clientEmail: process.env.GENERAL_CLIENT_EMAIL || '',
}
