# Logout Functionality

Complete logout functionality has been implemented with the following components:

## Components

### LogoutButton

- Located: `/src/features/auth/components/LogoutButton/LogoutButton.tsx`
- Reusable logout button with customizable appearance
- Shows loading state during logout process

### NavUser (Updated)

- Located: `/src/shared/components/AppSidebar/NavUser.tsx`
- Sidebar user dropdown now includes functional logout
- Shows loading state during logout

## Hooks

### useLogout

- Located: `/src/features/auth/hooks/useLogout.ts`
- Simple hook for logout functionality
- Returns logout function, loading state, and error state

### useLogoutManager

- Located: `/src/features/auth/managers/logout.manager.ts`
- Advanced logout manager with API integration
- Handles token invalidation on server
- Provides navigation after logout

## API

### Logout Query

- Located: `/src/features/auth/queries/logout.query.ts`
- Handles API call to `/api/auth/logout`
- Uses React Query for state management

## Features

- ✅ API Integration with server token invalidation
- ✅ Local storage cleanup (tokens and user data)
- ✅ State management (Zustand store updates)
- ✅ Automatic redirect to login page
- ✅ Error handling and fallback scenarios
- ✅ Loading states and user feedback
- ✅ TypeScript support

## Usage

The logout functionality is already integrated into the sidebar user dropdown. Users can click "Log out" from the user menu to log out of the application.
