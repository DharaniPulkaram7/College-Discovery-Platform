const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/auth");
const { reviewValidator } = require("../validators");

const prisma = new PrismaClient();

const createReview = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const { error, value } = reviewValidator.validate(req.body);

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        collegeId,
        userId: req.user.id,
        ...value,
      },
    });

    // Update college rating (simple average)
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.college.update({
      where: { id: collegeId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    sendSuccess(res, review, 201);
  } catch (error) {
    next(error);
  }
};

const getCollegeReviews = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { collegeId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    const total = await prisma.review.count({ where: { collegeId } });

    sendSuccess(res, {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return sendError(res, "Review not found", 404);
    }

    if (review.userId !== req.user.id) {
      return sendError(res, "Unauthorized", 403);
    }

    const collegeId = review.collegeId;

    await prisma.review.delete({
      where: { id },
    });

    // Update college rating
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
    });

    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await prisma.college.update({
        where: { id: collegeId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: allReviews.length,
        },
      });
    }

    sendSuccess(res, null, 200, "Review deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getCollegeReviews,
  deleteReview,
};
