# Noteshare 📝

A collaborative note-sharing web application that enables users to create groups, share notes, and collaborate seamlessly with flexible permissions and real-time updates.

## ✨ Features

- **🔐 User Authentication**: Secure sign up/sign in with Email/Password or Google OAuth
- **👥 Group Management**: Create and manage private or public groups for note sharing
- **⚡ Real-time Collaboration**: Share and edit notes with team members instantly
- **🛡️ Flexible Permissions**: Role-based access control with admin and editor permissions
- **📁 File Management**: Upload and manage files seamlessly via Cloudinary integration
- **🔒 Secure Authentication**: JWT-based authentication with refresh tokens
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🚀 Modern Tech Stack**: Built with React.js, Node.js, and MongoDB

## 🛠️ Tech Stack

| Component          | Technology             |
| ------------------ | ---------------------- |
| **Frontend**       | React.js               |
| **Backend**        | Node.js, Express.js    |
| **Database**       | MongoDB                |
| **Authentication** | JWT + Google OAuth 2.0 |
| **File Storage**   | Cloudinary             |

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed and set up:

- **Node.js** >= 18.x ([Download here](https://nodejs.org/))
- **MongoDB** account/cluster ([MongoDB Atlas](https://cloud.mongodb.com/))
- **Cloudinary** account ([Sign up here](https://cloudinary.com/))
- **Google Developer Console** project for OAuth ([Google Console](https://console.developers.google.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/noteshare.git
   cd noteshare
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the **backend** folder with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=your-mongodb-connection-string

# JWT Secrets (use strong, random strings)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Cloudinary Configuration
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/googlesignin/callback
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control. Add it to your `.gitignore` file.

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The app will open at `http://localhost:5173`

## 📁 Project Structure

```
noteshare/
├── backend/                 # Node.js + Express API
│   ├── src/
│   ├── .env                 # Environment variables
│   ├── .gitignore
│   └── package.json
├── frontend/                # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## 🔑 Setting Up External Services

### MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get your connection string and add it to `MONGODB_URI` in your `.env` file

### Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your `.env` file

### Google OAuth

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/googlesignin/callback` (development)
   - `https://yourdomain.com/api/auth/googlesignin/callback` (production)

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**

- Check if MongoDB connection string is correct
- Ensure all environment variables are set
- Verify Node.js version >= 18.x

**Google OAuth not working**

- Verify redirect URLs in Google Console
- Check client ID and secret in `.env` file
- Ensure callback URL matches exactly

**File uploads failing**

- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file types are being uploaded

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [Express.js](https://expressjs.com/) for the robust backend framework
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Cloudinary](https://cloudinary.com/) for seamless file management

## 📧 Support

If you have any questions or need help getting started, please:

- Open an issue on GitHub
- Check existing issues for solutions
- Contact the maintainers

---

\*\*Happy note sharing! �
