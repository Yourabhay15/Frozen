# FROZEN THREAD - E-commerce Platform

A comprehensive e-commerce platform built with Next.js 14, PostgreSQL, and Prisma, featuring a modern design, complete backend functionality, and Indian market integrations.

## 🚀 Features

### Frontend Features
- **Modern UI/UX** with glassmorphism design
- **Responsive Design** for all devices
- **Product Catalog** with filtering and search
- **Shopping Cart** with real-time updates
- **User Authentication** with secure password hashing
- **Product Details** with image gallery and zoom
- **Checkout Process** with multiple payment options
- **Order Management** for users and admins
- **Wishlist System** with persistent storage
- **Product Reviews & Ratings** with verification
- **Enhanced Search** with real-time suggestions
- **Email Notifications** with professional templates

### Backend Features
- **PostgreSQL Database** with Prisma ORM
- **RESTful API** with proper error handling
- **User Management** with roles and permissions
- **Product Management** with CRUD operations
- **Order Processing** with status tracking
- **Cart Management** with persistent storage
- **Wishlist Management** with user associations
- **Review System** with rating calculations
- **Search Engine** with advanced filtering
- **Email Queue System** with template support
- **Image Upload** functionality
- **Admin Dashboard** with analytics

### Indian Market Integration
- **Indian Rupee (₹)** currency support
- **Payment Gateways**: Razorpay, Paytm, PhonePe, Google Pay
- **Shipping Partners**: Delhivery, Blue Dart, DTDC, India Post
- **Indian States** dropdown for addresses
- **PIN Code** validation
- **GST-ready** pricing structure

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Custom auth with bcrypt
- **State Management**: React Context
- **Icons**: Lucide React

## 📁 Project Structure

\`\`\`
frozen-thread-ecommerce/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── products/      # Product CRUD operations
│   │   ├── cart/          # Cart management
│   │   ├── orders/        # Order processing
│   │   ├── wishlist/      # Wishlist operations
│   │   ├── reviews/       # Review system
│   │   ├── search/        # Search functionality
│   │   └── emails/        # Email notifications
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── checkout/          # Checkout process
│   ├── wishlist/          # Wishlist page
│   └── orders/            # Order history
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── checkout/         # Checkout components
│   ├── wishlist/         # Wishlist components
│   ├── reviews/          # Review components
│   ├── search/           # Search components
│   ├── payment/          # Payment integration
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── auth-context.tsx  # Authentication context
│   ├── currency.ts       # Currency formatting
│   ├── database.ts       # Database operations
│   ├── prisma.ts         # Prisma client
│   ├── email-service.ts  # Email service
│   └── types.ts          # TypeScript types
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── scripts/              # Setup and utility scripts
│   └── setup-db.ts      # Database setup script
└── public/               # Static assets
\`\`\`

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products with reviews and ratings
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product by ID with reviews
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Cart
- `GET /api/cart?userId=[id]` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update cart item
- `DELETE /api/cart/[itemId]` - Remove from cart

### Wishlist
- `GET /api/wishlist?userId=[id]` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/[productId]` - Remove from wishlist
- `GET /api/wishlist/[productId]` - Check if item is in wishlist

### Reviews
- `GET /api/reviews?productId=[id]` - Get product reviews
- `POST /api/reviews` - Create new review
- `POST /api/reviews/[id]/helpful` - Mark review as helpful

### Search
- `GET /api/search?q=[query]&type=products` - Search products
- `GET /api/search?q=[query]&type=suggestions` - Get search suggestions

### Orders
- `GET /api/orders` - Get all orders (admin) or user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PATCH /api/orders/[id]` - Update order status

### Email
- `POST /api/emails` - Send email notification

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Database Setup

1. **Install PostgreSQL**
   \`\`\`bash
   # On macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # On Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # On Windows
   # Download and install from https://www.postgresql.org/download/windows/
   \`\`\`

2. **Create Database**
   \`\`\`bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database and user
   CREATE DATABASE frozen_thread_db;
   CREATE USER frozen_thread_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE frozen_thread_db TO frozen_thread_user;
   \q
   \`\`\`

3. **Clone and Setup Project**
   \`\`\`bash
   git clone <repository-url>
   cd frozen-thread-ecommerce
   npm install
   \`\`\`

4. **Configure Environment Variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your database credentials:
   \`\`\`env
   DATABASE_URL="postgresql://frozen_thread_user:your_password@localhost:5432/frozen_thread_db?schema=public"
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

5. **Initialize Database**
   \`\`\`bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # Seed database with sample data
   npm run db:seed
   \`\`\`

6. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   Navigate to `http://localhost:3000`

### Quick Setup Script

For a one-command setup, run:
\`\`\`bash
npm run setup
\`\`\`

This will install dependencies, setup the database, and seed it with sample data.

## 👤 Demo Accounts

### Admin Account
- **Email**: admin@frozenthread.com
- **Password**: admin123
- **Access**: Full admin dashboard and product management

### User Account
- **Email**: user@frozenthread.com
- **Password**: user123
- **Access**: Shopping and order management

### Premium Customer
- **Email**: customer@frozenthread.com
- **Password**: customer123
- **Access**: Customer with saved addresses and preferences

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with authentication
- **products** - Product catalog with variants
- **addresses** - User shipping/billing addresses
- **cart_items** - Shopping cart persistence
- **wishlist_items** - User wishlists
- **orders** - Order management
- **order_items** - Order line items
- **product_reviews** - Product reviews and ratings
- **email_notifications** - Email queue system

### Key Features
- **Foreign Key Constraints** for data integrity
- **Unique Constraints** to prevent duplicates
- **Indexes** for optimal query performance
- **Cascading Deletes** for data consistency
- **Enum Types** for status management

## 🔧 Database Commands

\`\`\`bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Generate Prisma client
npx prisma generate
\`\`\`

## 🎨 Design System

- **Colors**: Blue and purple gradients with dark theme
- **Typography**: Inter font family
- **Components**: Consistent glassmorphism design
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first approach

## 🔄 State Management

- **Authentication**: React Context with PostgreSQL persistence
- **Cart**: Database-driven with real-time updates
- **Wishlist**: PostgreSQL with user associations
- **Products**: Server-side rendering with client-side interactions
- **Reviews**: Database-driven with rating calculations
- **Search**: Real-time with database queries

## 📱 Mobile Optimization

- **Responsive Design** for all screen sizes
- **Touch-friendly** interface elements
- **Mobile Navigation** with hamburger menu
- **Optimized Images** with Next.js Image component
- **Progressive Web App** ready

## 🚀 Deployment

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Railway** (with PostgreSQL)
- **Heroku** (with Heroku Postgres)
- **DigitalOcean App Platform**
- **AWS** (with RDS PostgreSQL)

### Environment Variables for Production

\`\`\`env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
\`\`\`

## 🔧 Performance Features

- **Server-Side Rendering** for SEO
- **Database Indexing** for fast queries
- **Image Optimization** with Next.js
- **Code Splitting** automatic with App Router
- **Connection Pooling** with Prisma
- **Lazy Loading** for components
- **Caching** strategies for API responses

## 🛡️ Security Features

- **Password Hashing** with bcrypt
- **SQL Injection Protection** with Prisma
- **Input Validation** on all API endpoints
- **Role-based Access Control**
- **CSRF Protection** built into Next.js
- **Secure Headers** automatically set
- **File Upload Validation**

## 🎯 Future Enhancements

- **Real-time Notifications** with WebSockets
- **Advanced Analytics** with detailed reporting
- **Multi-language Support** with i18n
- **PWA Features** for mobile app experience
- **Advanced Search** with Elasticsearch
- **Recommendation Engine** with ML
- **Social Features** with user interactions
- **Advanced Admin Dashboard** with charts

## 📊 Monitoring & Analytics

- **Database Performance** monitoring with Prisma
- **Error Tracking** ready for Sentry integration
- **User Analytics** ready for Google Analytics
- **Performance Monitoring** with Next.js built-in tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints
- Test with the demo accounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the modern e-commerce experience**
\`\`\`

Now let's add the setup script to package.json:
