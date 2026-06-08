const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  createSession,
  getSessions,
  getSession,
  getReport,
} = require("../controllers/research.controller");

//RESTful routes
router.post("/", protect, createSession);           // POST /api/research
router.get("/", protect, getSessions);              // GET /api/research
router.get("/:id", protect, getSession);            // GET /api/research/:id
router.get("/:id/report", protect, getReport);      // GET /api/research/:id/report

module.exports = router;