# Ayurherb 2.0 - Herbal Supply Chain Management Frontend

![Ayurherb Logo](https://img.shields.io/badge/Ayurherb-2.0-green?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 🌿 Overview

Ayurherb 2.0 is a comprehensive frontend application for herbal supply chain management, specifically designed for the herbal and Ayurvedic medicine industry. This static React application provides a complete user interface for managing supply chain operations from farm to consumer with mock data and local storage.

### 🎯 Key Features

- **👥 Multi-Role Dashboard**: Farmer, Processor, Lab, Admin, and Customer portals
- **📊 Real-time Analytics**: Comprehensive dashboards with interactive charts
- **🔍 Complete Traceability**: Track products from harvest to consumer with mock data
- **📱 QR Code Integration**: Easy product verification for end consumers
- **🧪 Lab Testing Interface**: Quality assurance and compliance tracking UI
- **💾 Local Data Management**: Browser localStorage for data persistence
- **🎨 Modern UI/UX**: Glassmorphism design with responsive layouts
- **🔄 Mock Blockchain**: Simulated blockchain interactions for demonstration

## 🏗️ Architecture

### Frontend-Only Application
- **Framework**: React 18.2.0 with Vite
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Routing**: React Router DOM v6
- **Charts**: Recharts for data visualization
- **QR Codes**: React QR Code generation
- **Icons**: Lucide React icon library
- **Data Storage**: Browser localStorage for persistence
- **Mock APIs**: Simulated backend responses with realistic data

## 📁 Project Structure

```
Ayurherb-2.0/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/        # Layout components (Sidebar, Topbar)
│   │   │   └── UI/            # UI components (Cards, Modals, Toast)
│   │   ├── pages/             # Page components
│   │   │   ├── Admin/         # Admin dashboard
│   │   │   ├── Customer/      # Customer portal and dashboard
│   │   │   ├── Lab/           # Lab testing interface
│   │   │   ├── Processor/     # Processor dashboard
│   │   │   └── ...           # Other role-specific pages
│   │   ├── utils/             # Utility functions and mock APIs
│   │   └── App.jsx           # Main application component
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ayurherb-2.0
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 🌐 Access the Application

- **Frontend**: http://localhost:5173

The application runs entirely in the browser with mock data and localStorage persistence.

## 👥 User Roles & Features

### 🌾 Farmer Portal
- Submit herb collections with GPS coordinates
- Track collection status (Queued → Synced → Verified)
- View harvest history and quality metrics
- Generate collection certificates

### 🏭 Processor Dashboard
- View verified collections as processing batches
- Add processing steps (Drying, Grinding, Storage, etc.)
- Mock blockchain integration for demonstration
- Track processing progress and efficiency metrics
- Generate processing certificates

### 🧪 Lab Testing Interface
- Conduct quality tests on processed batches
- Record test results and compliance data
- Generate lab certificates and reports
- Track testing history and trends

### 👑 Admin Dashboard
- System-wide analytics and reporting
- User management and role assignments
- Supply chain monitoring and optimization
- Compliance and audit trail management

### 🛒 Customer Portal
- **Dashboard**: Personal purchase analytics, loyalty points, spending trends
- **Product Search**: Advanced search with filters (name, batch ID, farmer, location)
- **Purchase History**: Order tracking with status updates
- **Market Trends**: Real-time herb price tracking with trend charts
- **Inventory Management**: Personal herb inventory with expiry tracking
- **QR Code Verification**: Scan products for authenticity and traceability

## 🔄 Mock Data System

### Local Storage APIs
The application uses a comprehensive mock API system that simulates backend functionality:

- **Collections Management**: Farmer submission tracking
- **Batch Processing**: Processing step management
- **Lab Testing**: Quality test result storage
- **User Management**: Role-based access simulation
- **Blockchain Simulation**: Mock transaction hashes and confirmations

### Data Flow
1. User submits data through forms
2. Data is validated and stored in localStorage
3. Mock processing delays simulate real-world operations
4. Realistic transaction hashes and confirmations are generated
5. Real-time updates across different views via storage events

## 🎨 UI/UX Features

### Design System
- **Glassmorphism Effects**: Modern blur and transparency effects
- **Gradient Backgrounds**: Dynamic color schemes
- **Interactive Charts**: Recharts with hover animations
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time feedback system

### Animation & Interactions
- **Staggered Loading**: Sequential component animations
- **Hover Effects**: Scale and glow transformations
- **Progress Indicators**: Visual progress tracking
- **Status Color Coding**: Intuitive status representation

## 📊 Data Management

### Local Storage Integration
- **Cross-Application Sync**: Real-time data sharing between roles
- **Event Listeners**: Storage event handling for live updates
- **Data Persistence**: Maintains state across browser sessions
- **Mock Data**: Comprehensive dummy data for demonstration

### Data Schema
- **Collections**: Farmer submission data
- **Batches**: Processing batch information
- **Processing Steps**: Detailed processing records
- **Lab Results**: Quality test data
- **Mock Blockchain Records**: Simulated transaction hashes and proofs

## 🧪 Testing & Development

### Development
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Static Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy the dist/ folder to any static hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

The application is a static React app that can be deployed to any static hosting service.

## 🔧 Troubleshooting

### Common Issues

1. **Application Not Loading**
   - Ensure Node.js is installed (v16 or higher)
   - Run `npm install` in the frontend directory
   - Check if port 5173 is available

2. **Data Not Persisting**
   - Check browser localStorage for data
   - Clear localStorage and refresh to reset data
   - Ensure browser allows localStorage

3. **Charts Not Displaying**
   - Ensure all dependencies are installed
   - Check browser console for errors
   - Try refreshing the page

4. **Port Conflicts**
   - Modify `vite.config.js` to use a different port
   - Use `npm run dev -- --port 3000` to specify port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **UI/UX**: Modern Glassmorphism Design, Responsive Layout
- **Data Visualization**: Recharts, Interactive Charts
- **State Management**: localStorage, React Hooks
- **Mock Systems**: Simulated APIs and Blockchain Integration

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

## 🔄 Version History

- **v2.0.0**: Frontend-only application with mock blockchain integration
- **v1.5.0**: Multi-role dashboard implementation
- **v1.0.0**: Initial release with basic supply chain tracking

---

**Built with ❤️ for the Ayurvedic and Herbal Medicine Industry**

*A comprehensive frontend application demonstrating supply chain management from farm to consumer.*
