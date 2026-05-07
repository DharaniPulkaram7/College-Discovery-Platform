const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/auth");

const prisma = new PrismaClient();

const saveCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.params;

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    if (existing) {
      return sendError(res, "College already saved", 400);
    }

    // Save college
    const saved = await prisma.savedCollege.create({
      data: {
        userId: req.user.id,
        collegeId,
      },
    });

    sendSuccess(res, saved, 201);
  } catch (error) {
    next(error);
  }
};

const unsaveCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.params;

    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    if (!saved) {
      return sendError(res, "College not in saved list", 404);
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    sendSuccess(res, null, 200, "College removed from saved");
  } catch (error) {
    next(error);
  }
};

const getSavedColleges = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.user.id },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            averageFees: true,
            placement: true,
            rating: true,
            logoUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    const total = await prisma.savedCollege.count({
      where: { userId: req.user.id },
    });

    sendSuccess(res, {
      colleges: saved.map((s) => s.college),
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

const checkIfSaved = async (req, res, next) => {
  try {
    const { collegeId } = req.params;

    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    sendSuccess(res, { isSaved: !!saved });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveCollege,
  unsaveCollege,
  getSavedColleges,
  checkIfSaved,
};
