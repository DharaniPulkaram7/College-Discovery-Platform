const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/auth");

const prisma = new PrismaClient();

const examRules = {
  jee: [
    { maxRank: 1000, minRating: 4.7, minPlacement: 90 },
    { maxRank: 5000, minRating: 4.4, minPlacement: 85 },
    { maxRank: 15000, minRating: 4.0, minPlacement: 75 },
    { maxRank: Infinity, minRating: 3.5, minPlacement: 60 },
  ],
  neet: [
    { maxRank: 500, minRating: 4.7, minPlacement: 90 },
    { maxRank: 2000, minRating: 4.4, minPlacement: 85 },
    { maxRank: 8000, minRating: 4.0, minPlacement: 75 },
    { maxRank: Infinity, minRating: 3.5, minPlacement: 60 },
  ],
  cat: [
    { maxRank: 100, minRating: 4.7, minPlacement: 90 },
    { maxRank: 500, minRating: 4.4, minPlacement: 85 },
    { maxRank: 1500, minRating: 4.0, minPlacement: 75 },
    { maxRank: Infinity, minRating: 3.5, minPlacement: 60 },
  ],
};

const getPredictionCriteria = (exam, rank) => {
  const rules = examRules[exam];
  if (!rules) return null;
  return rules.find((rule) => rank <= rule.maxRank);
};

const predictColleges = async (req, res, next) => {
  try {
    const exam = String(req.query.exam || "").trim().toLowerCase();
    const rank = parseInt(req.query.rank, 10);

    if (!exam || Number.isNaN(rank) || rank <= 0) {
      return sendError(res, "Please provide a valid exam and rank", 400);
    }

    const criteria = getPredictionCriteria(exam, rank);

    if (!criteria) {
      return sendError(res, "Exam type not supported", 400);
    }

    const recommendedColleges = await prisma.college.findMany({
      where: {
        rating: { gte: criteria.minRating },
        placement: { gte: criteria.minPlacement },
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        averageFees: true,
        placement: true,
        rating: true,
        reviewCount: true,
        logoUrl: true,
      },
      orderBy: [
        { rating: "desc" },
        { placement: "desc" },
        { averageFees: "asc" },
      ],
      take: 10,
    });

    const results = recommendedColleges.length
      ? recommendedColleges
      : await prisma.college.findMany({
          orderBy: [
            { rating: "desc" },
            { placement: "desc" },
            { averageFees: "asc" },
          ],
          take: 10,
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            averageFees: true,
            placement: true,
            rating: true,
            reviewCount: true,
            logoUrl: true,
          },
        });

    sendSuccess(res, {
      exam: exam.toUpperCase(),
      rank,
      criteria,
      results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predictColleges,
};
