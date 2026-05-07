# College Discovery Platform

A production-grade college discovery and comparison platform built with Next.js, Express, and PostgreSQL.

## Features Implemented

✅ **College Listing + Search**
- College cards with name, location, fees, rating
- Search by college name
- Filters: Location, Fees, Rating
- Pagination

✅ **College Detail Page**
- Overview with fees, courses, basic info
- Sections: Courses, Placements, Reviews
- Dynamic routing with Next.js

✅ **Compare Colleges**
- Select 2-3 colleges for comparison
- Detailed comparison table with fees, placement %, rating, location
- Decision-focused insights

✅ **Authentication + Saved Items**
- JWT-based authentication
- Save colleges and comparisons
- User-specific data access

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/college_discovery"
   JWT_SECRET="your_jwt_secret_here"
   ```

5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Seed the database:
   ```bash
   npm run prisma:seed
   ```

7. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. Start the frontend:
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment (Railway)

1. Create a Railway account at https://railway.app

2. Create a new PostgreSQL database in Railway

3. Push backend code to GitHub

4. Connect GitHub repo to Railway

5. Set environment variables in Railway:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `JWT_SECRET` (generate a secure secret)
   - `NODE_ENV=production`

6. Deploy

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com

2. Push frontend code to GitHub

3. Connect GitHub repo to Vercel

4. Set environment variable:
   - `NEXT_PUBLIC_API_URL` (your Railway backend URL + /api)

5. Deploy

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Colleges
- `GET /api/colleges` - List colleges with filters
- `GET /api/colleges/search` - Search colleges
- `GET /api/colleges/:id` - Get college details

### Saved Colleges
- `POST /api/saved/:collegeId` - Save college
- `DELETE /api/saved/:collegeId` - Unsave college
- `GET /api/saved` - Get saved colleges

### Comparisons
- `POST /api/comparisons` - Create comparison
- `GET /api/comparisons` - Get user comparisons
- `GET /api/comparisons/:id` - Get comparison details
- `DELETE /api/comparisons/:id` - Delete comparison

### Reviews
- `POST /api/reviews/:collegeId` - Add review
- `GET /api/reviews/:collegeId` - Get college reviews
- `DELETE /api/reviews/:id` - Delete review

### Predictor
- `GET /api/predictor?exam=JEE&rank=1200` - Get recommended colleges for an exam rank

## Database Schema

The application uses Prisma ORM with the following main models:
- User
- College
- Course
- Placement
- Review
- SavedCollege
- Comparison
- CollegeComparison

## Features Overview

### College Listing
- Responsive grid layout
- Real-time search
- Multiple filters
- Pagination
- Loading states

### College Details
- Tabbed interface (Overview, Courses, Placements, Reviews)
- Dynamic content loading
- Rule-based college predictor tool
- Review system with ratings

### Comparison Tool
- Side-by-side comparison table
- Decision insights
- Save/load comparisons

### Authentication
- Secure JWT tokens
- Protected routes
- User profile management

## Production Considerations

- Error handling and validation
- Loading states and empty states
- Responsive design
- Security (input validation, authentication)
- Database optimization with indexes
- API rate limiting (can be added)

## License

MIT License