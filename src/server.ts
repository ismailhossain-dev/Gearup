import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
const port = config.port;
const main = async () => {
  await prisma.$connect();
  console.log("Connected to the database successfully");
  try {
    app.listen(port, () => {
      console.log(`Server is running on $${port}`);
    });
  } catch (error) {
    console.log("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
