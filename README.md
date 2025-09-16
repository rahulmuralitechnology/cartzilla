# E-commerce Management System


- Dashboard ref: `https://github.com/DooPhiLong/E-commerce-sample-dataset-dashboard-report/tree/main`


A modern, feature-rich e-commerce management system built with React, TypeScript, and Ant Design.

## Features

### Store Management

- Create and manage multiple stores
- Store details including name, description, contact info
- Store status tracking (active/inactive/pending)
- Store logo upload support

### Category Management

- Hierarchical category structure (up to 3 levels)
- Drag-and-drop category reordering
- Multi-language support
- SEO metadata management
- Category attributes and discount rules
- Bulk actions support
- Tree view with expandable nodes

### Product Management

- Grid/list view of products
- Sorting and filtering options
- Search functionality
- Product status management (published/draft)
- Multiple image upload
- Comprehensive product details
- Bulk actions support

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit for state management
- Ant Design for UI components
- React Router for navigation
- Vite for development and building

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── categories/     # Category management components
│   ├── products/       # Product management components
│   └── stores/        # Store management components
├── pages/             # Page components
├── store/             # Redux store configuration
│   └── slices/        # Redux slices
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implementation

#### Store Management

- Uses Redux for state management
- CRUD operations for stores
- Form validation and error handling
- Responsive grid layout

#### Category Management

- Tree structure for hierarchical categories
- Drag-and-drop functionality
- SEO optimization support
- Multi-language capability

#### Product Management

- Advanced filtering and sorting
- Image management
- Status tracking
- Bulk operations

## Best Practices

- Component-based architecture
- Type safety with TypeScript
- State management with Redux Toolkit
- Responsive design
- Error handling and validation
- Code splitting and lazy loading
- Performance optimization
