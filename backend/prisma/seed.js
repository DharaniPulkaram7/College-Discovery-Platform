const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const collegesData = [
  {
    name: "Indian Institute of Technology Delhi",
    description: "One of India's premier engineering institutes",
    location: "New Delhi",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    websiteUrl: "https://home.iitd.ac.in",
    established: 1961,
    affiliationBody: "Autonomous",
    averageFees: 850000,
    placement: 95.5,
    rating: 4.8,
    logoUrl: "https://via.placeholder.com/150",
    bannerUrl: "https://via.placeholder.com/1200x400",
  },
  {
    name: "IIT Bombay",
    description: "Leading engineering institute with world-class facilities",
    location: "Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    websiteUrl: "https://www.iitb.ac.in",
    established: 1958,
    affiliationBody: "Autonomous",
    averageFees: 900000,
    placement: 96.2,
    rating: 4.9,
    logoUrl: "https://via.placeholder.com/150",
    bannerUrl: "https://via.placeholder.com/1200x400",
  },
  {
    name: "Delhi University",
    description: "Largest central university with multiple faculties",
    location: "New Delhi",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    websiteUrl: "https://www.du.ac.in",
    established: 1922,
    affiliationBody: "Autonomous",
    averageFees: 300000,
    placement: 75.3,
    rating: 4.2,
    logoUrl: "https://via.placeholder.com/150",
    bannerUrl: "https://via.placeholder.com/1200x400",
  },
  {
    name: "Mumbai University",
    description: "One of the oldest universities in Asia",
    location: "Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    websiteUrl: "https://www.mu.ac.in",
    established: 1857,
    affiliationBody: "Autonomous",
    averageFees: 280000,
    placement: 72.5,
    rating: 4.1,
    logoUrl: "https://via.placeholder.com/150",
    bannerUrl: "https://via.placeholder.com/1200x400",
  },
  {
    name: "Manipal Institute of Technology",
    description: "Private university with strong industry connections",
    location: "Manipal",
    city: "Manipal",
    state: "Karnataka",
    country: "India",
    websiteUrl: "https://www.manipal.edu",
    established: 1953,
    affiliationBody: "Private",
    averageFees: 1200000,
    placement: 92.1,
    rating: 4.5,
    logoUrl: "https://via.placeholder.com/150",
    bannerUrl: "https://via.placeholder.com/1200x400",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.collegeComparison.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create colleges
  for (const collegeData of collegesData) {
    const college = await prisma.college.create({
      data: collegeData,
    });

    // Add courses
    const coursesForCollege = [
      {
        name: "Computer Science Engineering",
        duration: "4 years",
        specialization: "Software Development",
        eligibility: "10+2 with PCM",
        cutoff: 95.5,
        fees: college.averageFees,
      },
      {
        name: "Mechanical Engineering",
        duration: "4 years",
        specialization: "Manufacturing",
        eligibility: "10+2 with PCM",
        cutoff: 90.2,
        fees: college.averageFees,
      },
      {
        name: "Electrical Engineering",
        duration: "4 years",
        specialization: "Power Systems",
        eligibility: "10+2 with PCM",
        cutoff: 92.1,
        fees: college.averageFees,
      },
    ];

    for (const courseData of coursesForCollege) {
      await prisma.course.create({
        data: {
          collegeId: college.id,
          ...courseData,
        },
      });
    }

    // Add placements
    for (let year = 2021; year <= 2024; year++) {
      await prisma.placement.create({
        data: {
          collegeId: college.id,
          year,
          totalStudents: Math.floor(Math.random() * 500) + 300,
          placed: Math.floor(Math.random() * 450) + 250,
          avgPackage: Math.floor(Math.random() * 15) + 12,
          maxPackage: Math.floor(Math.random() * 60) + 40,
          minPackage: 8,
        },
      });
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
