import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/test", authenticate, authorize("ADMIN"), (req, res) => {
  res.status(200).json({
    message: "You have admin access.",
    user: req.user,
  });
});

export default router;
