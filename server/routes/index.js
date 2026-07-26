import express from "express";
import taskRoute from "./taskRoute.js";
import userRoute from "./userRoute.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/task", taskRoute);

export default router;
