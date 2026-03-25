# Aethelgard Boutique Hotel & Spa

[![Luxury Hospitality](https://img.shields.io/badge/Experience-Luxury-D4DE95?style=for-the-badge&logo=appveyor)](https://github.com/tamed29/Aethelgard-Boutique-Hotel-Spa)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20MongoDB-3D4127?style=for-the-badge)](https://github.com/tamed29/Aethelgard-Boutique-Hotel-Spa)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

A narrative boutique hotel experience set in the heart of the Wychwood Forest. This project combines high-end guest immersion with a robust, real-time administrative control terminal.

## 🚀 Features

### Guest Experience
- **Narrative Discovery:** Immerse yourself in the story of Aethelgard through curated experiences and seasonal rituals.
- **Dynamic Sanctuary Selection:** Explore uniquely themed room galleries (Botanical Oasis, Forest Retreat, etc.) with real-time availability.
- **Thermal Protocols:** Seamlessly book spa rituals and wellness sessions.
- **The Pulse:** Real-time communication hub for guest inquiries and specialized requests.

### Admin Control Terminal
- **Signal Log:** Real-time notification system for reservations, inquiries, and messages.
- **Advanced Inventory Hub:** Multi-unit management with conflict guarding and atomic reservation logic.
- **Media Library:** Centralized management for the hotel's visual narrative.
- **Terminal Settings:** Global configuration for peak-season pricing and sanctuary maintenance.

## 🛠 Tech Stack

- **Frontend:** Next.js 15+, React, Tailwind CSS v4, Framer Motion
- **Backend:** Node.js, Express, Socket.io (Real-time events)
- **Database:** MongoDB (Mongoose ODM)
- **State/Data:** React Query, Zod (Validation), Sonner (Toasts)
- **Aesthetic:** Custom "Aethelgard Dark Ops" design system

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### Local Setup

1. **Clone the Sanctuary:**
   ```bash
   git clone https://github.com/tamed29/Aethelgard-Boutique-Hotel-Spa.git
   cd Aethelgard-Boutique-Hotel-Spa
   ```

2. **Initialize Backend:**
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI, JWT_SECRET, PORT, etc.
   npm run dev
   ```

3. **Initialize Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Create .env.local with NEXT_PUBLIC_API_URL
   npm run dev
   ```

4. **Access the Terminal:**
   Open [http://localhost:3000](http://localhost:3000) for the guest experience.
   Navigate to `/admin` for the Control Terminal.

## 📂 Project Structure

```text
/project-root
├── frontend/        # Next.js Application (Guest & Admin UI)
├── backend/         # Node.js/Express API & Socket Server
├── shared/          # Shared types and constants
├── docs/            # Technical documentation and guides
└── public/          # Global assets & branding
```

## 🤝 Contributing

Contributions to the Aethelgard ecosystem are welcome. Whether it's a bug fix, feature request, or narrative enhancement, please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.

---
*Aethelgard — Where the ancient forest meets modern sanctuary.*
