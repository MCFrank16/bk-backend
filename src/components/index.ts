import express from 'express';
import fs from 'fs';


const router = express.Router();

router.get("/", (req, res) => {
    res.send("Farmer ordering API.");
});

fs.promises.readdir(__dirname).then(async (components) => {
  for (const component of components) {
    try {
      if (fs.existsSync(`${__dirname}/${component}/router.ts`)) {
        const module = await import(`./${component}/router`);
        router.use(`/${component}`.toLowerCase(), module.default);
      }
    } catch (e) {
      console.error(`Failed to load router for component ${component}:`, e);
    }
  }
}).catch((err) => {
  console.error("Unable to scan directory:", err);
});

export default router;
