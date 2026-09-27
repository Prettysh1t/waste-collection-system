const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/categories", requestController.getCategories);

router.post("/requests", authMiddleware, requestController.createRequest);
router.get("/requests", authMiddleware, requestController.getMyRequests);
router.get("/requests/:id", authMiddleware, requestController.getRequestById);
router.put("/requests/:id/cancel", authMiddleware, requestController.cancelRequest);

module.exports = router;
