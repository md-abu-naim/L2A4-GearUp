import app from "./app.js"
import config from "./config/index.js"
import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect()
    console.log('Conected to the database');

    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })

  } catch (error) {
    console.error('Error starting the server', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()