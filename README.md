# MERN Stack Portfolio Website

A professional, dynamic portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Dynamic Content**: Projects and skills managed through MongoDB
- **Contact Form**: Functional contact form with email notifications
- **Smooth Animations**: Framer Motion animations and transitions
- **Professional Layout**: Clean, modern design with gradient themes
- **SEO Optimized**: Meta tags and semantic HTML structure

## Tech Stack

### Frontend
- React 18
- Framer Motion (animations)
- React Router (navigation)
- Axios (API calls)
- React Icons
- CSS3 with modern features

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Nodemailer (email functionality)
- CORS, Helmet (security)
- Rate limiting

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Portfolio Website
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000)

## Project Structure

```
Portfolio Website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
└── package.json          # Root package.json
```

## Customization

### Personal Information
1. Update personal details in:
   - `client/src/components/Hero.js`
   - `client/src/components/Footer.js`
   - `client/src/pages/Contact.js`

### Projects
Add your projects by:
1. Using the API endpoints to add projects to MongoDB
2. Or modify the fallback data in `client/src/pages/Projects.js`

### Skills
Update your skills in:
1. MongoDB through API endpoints
2. Or modify fallback data in `client/src/components/Skills.js`

### Styling
- Main styles: `client/src/styles/App.css`
- Color scheme: Update CSS custom properties
- Fonts: Change in `client/public/index.html`

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `POST /api/projects` - Create new project

### Skills
- `GET /api/skills` - Get all skills grouped by category
- `POST /api/skills` - Create new skill

### Contact
- `POST /api/contact` - Send contact form message

## Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder

### Database
- Use MongoDB Atlas for production
- Update `MONGODB_URI` in environment variables

## Email Configuration

For contact form to work:
1. Use Gmail with App Password
2. Update `EMAIL_USER` and `EMAIL_PASS` in `.env`
3. Enable 2FA and generate App Password in Gmail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.