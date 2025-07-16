# 🧊 FROZEN THREAD - Neon Database Setup Guide

Complete guide to setting up your free Neon PostgreSQL database for the FROZEN THREAD e-commerce platform.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Free Neon Database

1. **Visit**: https://neon.tech
2. **Sign Up**: Create a free account (no credit card required)
3. **Create Project**: 
   - Project Name: `frozen-thread-db`
   - Region: Choose closest to you
   - PostgreSQL Version: Latest (default)

### Step 2: Get Connection String

1. Go to your project dashboard
2. Click **"Connect"** button
3. Copy the connection string that looks like:
   \`\`\`
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   \`\`\`

### Step 3: Configure Environment

Create/update your `.env.local` file:

\`\`\`env
# Neon Database URL
DATABASE_URL="your-connection-string-here"

# NextAuth Configuration  
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Upload Configuration
UPLOAD_DIR="./public/uploads"
\`\`\`

### Step 4: Install & Setup

\`\`\`bash
# Install dependencies
npm install

# Complete setup (creates tables + sample data)
npm run setup

# Start development server
npm run dev
\`\`\`

## 🎯 What You Get FREE

- ✅ **500MB PostgreSQL Database** (plenty for development)
- ✅ **Unlimited Queries** (no restrictions)
- ✅ **Automatic Backups** (your data is safe)
- ✅ **SSL Security** (production-ready)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Real-time Monitoring** (track performance)

## 📋 Database Schema

The setup creates these tables automatically:

### Users Table
\`\`\`sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
\`\`\`

### Products Table
\`\`\`sql
products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  images TEXT[],
  sizes VARCHAR(50)[],
  colors VARCHAR(50)[],
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false
)
\`\`\`

### Orders Table
\`\`\`sql
orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
\`\`\`

And more tables for cart items, wishlist, reviews, and notifications.

## 🛠️ Available Commands

### Database Commands
\`\`\`bash
npm run db:test      # Test database connection
npm run db:init      # Create tables only
npm run db:seed      # Add sample data only
npm run db:reset     # Reset database (WARNING: Deletes all data)
\`\`\`

### Development Commands
\`\`\`bash
npm run help         # Show complete help menu
npm run status       # Check system status
npm run setup        # Complete setup
npm run dev          # Start development server
\`\`\`

## 👤 Demo Accounts

After running `npm run setup`, you'll have these demo accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Admin | admin@frozenthread.com | admin123 | Full admin access |
| User | user@frozenthread.com | user123 | Regular user |
| Customer | customer@frozenthread.com | customer123 | Premium customer |

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Endpoints**: http://localhost:3000/api/*

## 🔧 Troubleshooting

### Connection Issues

**Problem**: Database connection failed
\`\`\`bash
# Test your connection
npm run db:test

# Check status
npm run status
\`\`\`

**Solutions**:
- Verify DATABASE_URL format includes `?sslmode=require`
- Check if Neon project is active
- Ensure internet connection is stable

### Setup Issues

**Problem**: Tables not created
\`\`\`bash
# Initialize tables manually
npm run db:init

# Then seed data
npm run db:seed
\`\`\`

**Problem**: Sample data missing
\`\`\`bash
# Add sample data
npm run db:seed
\`\`\`

### Environment Issues

**Problem**: Environment variables not loaded
- Ensure `.env.local` file exists in project root
- Check file has correct format (no spaces around =)
- Restart development server after changes

## 📊 Database Monitoring

### Neon Dashboard Features
- **Query Performance**: Monitor slow queries
- **Connection Stats**: Track active connections
- **Storage Usage**: Monitor database size
- **Backup Status**: Automatic backup verification

### Application Monitoring
\`\`\`bash
# Check system status
npm run status

# Test database performance
npm run db:test
\`\`\`

## 🚀 Production Deployment

### Environment Variables for Production
\`\`\`env
DATABASE_URL="your-production-neon-url"
NEXTAUTH_SECRET="strong-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
\`\`\`

### Deployment Platforms

**Vercel (Recommended)**:
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Other Platforms**:
- Netlify
- Railway  
- Render
- DigitalOcean App Platform

## 🔒 Security Best Practices

### Database Security
- ✅ SSL connections enforced
- ✅ Connection pooling enabled
- ✅ Automatic backups
- ✅ IP allowlisting available

### Application Security
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ SQL injection protection
- ✅ CORS configuration

## 📈 Scaling Your Database

### Free Tier Limits
- **Storage**: 500MB
- **Compute**: 1 vCPU, 1GB RAM
- **Connections**: 100 concurrent

### Upgrade Options
- **Pro Plan**: $19/month
  - 10GB storage
  - 2 vCPU, 4GB RAM
  - 1000 connections

- **Scale Plan**: $69/month
  - 100GB storage
  - 4 vCPU, 16GB RAM
  - 5000 connections

## 🆘 Getting Help

### Quick Help Commands
\`\`\`bash
npm run help         # Complete help menu
npm run status       # System status check
npm run db:test      # Database connection test
\`\`\`

### Support Resources
- **Neon Documentation**: https://neon.tech/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Project Issues**: Check troubleshooting section above

### Common Solutions
1. **Database connection issues**: Run `npm run db:test`
2. **Missing tables**: Run `npm run db:init`
3. **No sample data**: Run `npm run db:seed`
4. **Complete reset**: Run `npm run setup`

## 🎉 Success Checklist

After setup, verify everything works:

- [ ] Database connection successful (`npm run db:test`)
- [ ] Tables created (`npm run status`)
- [ ] Sample data loaded (check admin dashboard)
- [ ] Demo accounts work (try logging in)
- [ ] Products display on homepage
- [ ] Shopping cart functions
- [ ] Admin dashboard accessible

## 💡 Pro Tips

1. **Development**: Use `npm run dev` for hot reloading
2. **Database**: Monitor usage in Neon dashboard
3. **Testing**: Use demo accounts for different user roles
4. **Debugging**: Check browser console for errors
5. **Performance**: Enable connection pooling in production

---

🎊 **Congratulations!** Your FROZEN THREAD e-commerce platform is now running with a professional cloud database, completely free! 

Ready to start building your online store? Run `npm run dev` and visit http://localhost:3000
