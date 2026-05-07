const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/auth");

const prisma = new PrismaClient();

const createComparison = async (req, res, next) => {
  try {
    const { collegeIds, name } = req.body;

    if (!collegeIds || collegeIds.length < 2 || collegeIds.length > 3) {
      return sendError(
        res,
        "Please select 2-3 colleges for comparison",
        400
      );
    }

    // Create comparison
    const comparison = await prisma.comparison.create({
      data: {
        userId: req.user.id,
        name: name || `Comparison ${new Date().toLocaleDateString()}`,
      },
    });

    // Add colleges to comparison
    for (const collegeId of collegeIds) {
      await prisma.collegeComparison.create({
        data: {
          comparisonId: comparison.id,
          collegeId,
        },
      });
    }

    // Fetch full comparison data
    const fullComparison = await prisma.comparison.findUnique({
      where: { id: comparison.id },
      include: {
        colleges: {
          include: {
            college: {
              include: {
                placements: {
                  orderBy: { year: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    sendSuccess(res, fullComparison, 201);
  } catch (error) {
    next(error);
  }
};

const getComparison = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comparison = await prisma.comparison.findUnique({
      where: { id },
      include: {
        colleges: {
          include: {
            college: {
              include: {
                courses: true,
                placements: {
                  orderBy: { year: "desc" },
                  take: 3,
                },
                reviews: {
                  take: 3,
                },
              },
            },
          },
        },
      },
    });

    if (!comparison) {
      return sendError(res, "Comparison not found", 404);
    }

    // Check authorization
    if (comparison.userId !== req.user.id) {
      return sendError(res, "Unauthorized", 403);
    }

    sendSuccess(res, comparison);
  } catch (error) {
    next(error);
  }
};

const getUserComparisons = async (req, res, next) => {
  try {
    const comparisons = await prisma.comparison.findMany({
      where: { userId: req.user.id },
      include: {
        colleges: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, { comparisons });
  } catch (error) {
    next(error);
  }
};

const deleteComparison = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comparison = await prisma.comparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      return sendError(res, "Comparison not found", 404);
    }

    if (comparison.userId !== req.user.id) {
      return sendError(res, "Unauthorized", 403);
    }

    await prisma.comparison.delete({
      where: { id },
    });

    sendSuccess(res, null, 200, "Comparison deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComparison,
  getComparison,
  getUserComparisons,
  deleteComparison,
};
