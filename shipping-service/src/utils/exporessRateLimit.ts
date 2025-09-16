import { rateLimit } from "express-rate-limit";

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max requests per IP
  standardHeaders: "draft-8", // Modern RateLimit headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers

  // Custom response when limit is reached
  handler: (req, res, next, options) => {
    res.status(429).json({
      success: "FAILED",
      message: "Too many requests — please slow down.",
    });
  },

  // Optional: Custom key generator if you want per API key / user / email limit
  keyGenerator: (req, res) => {
    return req.ip || "unknown-ip"; // Ensure a string is always returned
  },
});

export default limiter;
