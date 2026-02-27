# Selling Point

A modern sales automation platform built with Next.js, TypeScript, and Ant Design. Manage clients, opportunities, proposals, contracts, and more with role-based access control.

## 🚀 Features

- **Client Management** - Track clients, contacts, and engagement
- **Opportunity Pipeline** - Manage sales opportunities through stages
- **Proposals & Contracts** - Create and track proposals and contracts
- **Pricing Requests** - Handle pricing workflows
- **Dashboard & Analytics** - View KPIs, pipeline metrics, and performance
- **Role-Based Access Control (RBAC)** - Secure permissions for Admin, Sales Manager, Business Development Manager, and Sales Rep roles

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Ant Design](https://ant.design/)
- **Styling:** [antd-style](https://github.com/ant-design/antd-style)

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or pnpm

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thuwayba15/selling-point.git
   cd selling-point
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_API_URL=your_api_url_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages (login, register)
│   └── (protected)/       # Protected pages (dashboard, clients, etc.)
├── components/            # Reusable UI components
│   ├── auth/
│   ├── clients/
│   ├── contracts/
│   ├── dashboard/
│   ├── layout/
│   ├── opportunities/
│   ├── proposals/
│   └── pricing-requests/
├── providers/             # Context providers for state management
│   ├── auth/
│   ├── clients/
│   ├── contracts/
│   ├── dashboard/
│   └── ...
├── hooks/                 # Custom React hooks (useRbac, etc.)
├── hoc/                   # Higher-order components (withAuthGuard)
├── lib/                   # Utilities (API, routes, storage)
├── theme/                 # Theme configuration
└── utils/                 # Helper functions (RBAC, auth utils)
```

## 🔐 Authentication & Roles

The application supports four user roles:

- **Admin** - Full system access
- **Sales Manager** - Manage team and approve proposals
- **Business Development Manager** - Create opportunities and proposals
- **Sales Rep** - Manage assigned opportunities

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

```
