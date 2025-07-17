import { Router } from "express";
import interactions from "./interactions.js";

const router = Router();

router.use("/interactions", interactions);

export default router;
