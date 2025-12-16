# Smart Leftover Food Management & Waste Reduction Platform 🌱

A comprehensive web application that helps users manage leftover food, reduce waste, and promote sustainable consumption through AI-powered analysis and insights.

![Food Waste Management](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-v18+-green)
![React](https://img.shields.io/badge/React-18-blue)

## 🌟 Features

### User Features
- 📸 **Upload Food Images** - Capture or upload images of leftover food
- 🤖 **AI-Powered Analysis** - Get instant edibility status, spoilage indicators, and shelf life estimates
- 💡 **Smart Suggestions** - Receive creative reuse ideas, recipes, and storage tips
- 📊 **Personal Analytics** - Track your waste reduction progress and environmental impact
- 📜 **Food History** - View all past uploads with detailed analysis
- 🎓 **Waste Reduction Tips** - Learn best practices for food storage and sustainability

### Admin Features
- 👥 **User Management** - Monitor all registered users and their activity
- 📈 **System Analytics** - View system-wide waste reduction metrics
- 🍱 **Upload Monitoring** - Track all food uploads across the platform
- 📑 **Sustainability Reports** - Generate comprehensive environmental impact reports
- 🔐 **Role-Based Access** - Secure admin-only routes and features

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Google Gemini AI** - Image analysis and suggestions

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TailwindCSS** - Styling and design system
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Lucide React** - Icon library

## 📁 Project Structure

```
FoodWasteMangement/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── food.controller.js
│   │   ├── analytics.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── FoodUpload.model.js
│   │   └── WasteAnalytics.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── food.routes.js
│   │   ├── analytics.routes.js
│   │   └── admin.routes.js
│   ├── services/
│   │   ├── ai.service.js
│   │   └── analytics.service.js
│   ├── scripts/
│   │   └── seed-admin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── FoodCard.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── TipsPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminUploads.jsx
│   │   │       ├── AdminAnalytics.jsx
│   │   │       └── AdminReports.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FoodWasteMangement
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   
   Edit `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food-waste-management
   JWT_SECRET=your-super-secret-jwt-key
   GEMINI_API_KEY=your-gemini-api-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Create Admin User**
   ```bash
   cd ../backend
   npm run seed-admin
   ```
   
   Default admin credentials:
   - Email: `admin@foodwaste.com`
   - Password: `Admin@123`

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Access the Application**
   - User Interface: `http://localhost:5173`
   - API Health Check: `http://localhost:5000/api/health`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Food Management
- `POST /api/food/upload` - Upload and analyze food image
- `GET /api/food/history` - Get user's food history
- `GET /api/food/:id` - Get specific food upload
- `PUT /api/food/:id/action` - Update user action (reused/donated/etc.)
- `DELETE /api/food/:id` - Delete food upload

### Analytics
- `GET /api/analytics/personal` - Get personal analytics
- `GET /api/analytics/trends` - Get waste trends

### Admin (Protected)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/uploads` - Monitor all uploads
- `GET /api/admin/analytics` - System-wide analytics
- `GET /api/admin/reports` - Generate sustainability reports
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 UI Design

The application features a modern, clean design inspired by contemporary web applications:

- **Color Palette**: Green (primary), Blue (accent), Red (warnings)
- **Typography**: Inter (body), Outfit (headings)
- **Components**: Cards, badges, buttons with smooth animations
- **Responsive**: Mobile-first design with TailwindCSS
- **Dark Mode**: Admin panel with dark sidebar

## 🤖 AI Integration

The platform uses **Google Gemini Vision API** for:

1. **Edibility Detection** - Determines if food is safe, questionable, or spoiled
2. **Spoilage Analysis** - Identifies visible signs of spoilage
3. **Shelf Life Estimation** - Predicts how long food can be stored
4. **Reuse Suggestions** - Provides creative ways to repurpose leftovers
5. **Recipe Ideas** - Suggests recipes using the leftover food
6. **Storage Tips** - Offers best practices for food preservation

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  phoneNumber: String,
  location: String,
  stats: {
    totalUploads: Number,
    totalWastePrevented: Number,
    lastUploadDate: Date
  }
}
```

### FoodUpload Model
```javascript
{
  userId: ObjectId,
  imageUrl: String,
  analysis: {
    edibilityStatus: String,
    confidence: Number,
    spoilageIndicators: [String],
    estimatedShelfLife: String
  },
  suggestions: {
    reuseIdeas: [String],
    recipes: [String],
    storageTips: [String]
  },
  userAction: String,
  quantity: Number,
  wasteStatus: String
}
```

## 🌍 Environmental Impact

The platform helps users:
- Reduce household food waste by up to 30%
- Save an average of 2.5kg CO₂ per kg of food waste prevented
- Conserve approximately 1000L of water per kg of food saved
- Contribute to UN Sustainable Development Goals

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Google Gemini AI for image analysis
- ShopSy for UI/UX inspiration
- The open-source community

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for a sustainable future**
