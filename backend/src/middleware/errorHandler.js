const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: "Validation error",
      details: err.details.map((detail) => ({
        field: detail.context.label || detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  // Prisma errors
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Unique constraint violation",
      field: err.meta?.target?.[0] || "field",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};

module.exports = { errorHandler };
