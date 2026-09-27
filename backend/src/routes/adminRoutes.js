const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware, adminMiddleware);

router.get("/requests", adminController.getAllRequests);
router.get("/requests/:id", adminController.getRequestById);
router.put("/requests/:id/status", adminController.updateStatus);
router.get("/statistics", adminController.getStatistics);

module.exports = router;
