const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/auth");
const { collegeListValidator } = require("../validators");

const prisma = new PrismaClient();

const listColleges = async (req, res, next) => {
  try {
    const { error, value } = collegeListValidator.validate(req.query);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { search, location, maxFees, minFees, minRating, page, limit } =
      value;

    // Build filter
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.city = { contains: location, mode: "insensitive" };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.averageFees = {};
      if (minFees !== undefined) where.averageFees.gte = minFees;
      if (maxFees !== undefined) where.averageFees.lte = maxFees;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Get total count
    const total = await prisma.college.count({ where });

    // Fetch colleges
    const colleges = await prisma.college.findMany({
      where,
      select: {
        id: true,
        name: true,
        location: true,
        city: true,
        state: true,
        averageFees: true,
        placement: true,
        rating: true,
        reviewCount: true,
        logoUrl: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { rating: "desc" },
    });

    sendSuccess(res, {
      colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCollegeDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: {
          orderBy: { year: "desc" },
          take: 5,
        },
        reviews: {
          take: 5,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    sendSuccess(res, college);
  } catch (error) {
    next(error);
  }
};

const searchColleges = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return sendSuccess(res, { results: [] });
    }

    const colleges = await prisma.college.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { state: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        rating: true,
      },
      take: 10,
    });

    sendSuccess(res, { results: colleges });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listColleges,
  getCollegeDetail,
  searchColleges,
};
