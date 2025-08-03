/\*\*

- Logout functionality implementation
-
- This module provides complete logout functionality including:
-
- 1. **LogoutButton Component** (`/src/features/auth/components/LogoutButton/LogoutButton.tsx`)
- - Reusable logout button with customizable appearance
- - Shows loading state during logout process
- - Can be used anywhere in the app
-
- 2. **useLogout Hook** (`/src/features/auth/hooks/useLogout.ts`)
- - Simple hook for logout functionality
- - Returns logout function, loading state, and error state
- - Can be used in any component
-
- 3. **useLogoutManager Hook** (`/src/features/auth/managers/logout.manager.ts`)
- - Advanced logout manager with API integration
- - Handles token invalidation on server
- - Provides navigation after logout
- - Includes fallback for offline scenarios
-
- 4. **Updated NavUser Component** (`/src/shared/components/AppSidebar/NavUser.tsx`)
- - Sidebar user dropdown now includes functional logout
- - Shows loading state during logout
-

- ## Usage Examples

-

- ### Using LogoutButton component

- ```tsx

  ```
- import { LogoutButton } from '@/features/auth/components';
-
- // Simple logout button
- <LogoutButton />
-
- // Customized logout button
- <LogoutButton
- variant="destructive"
- size="lg"
- showText={false}
- />

- ```

  ```
-

- ### Using useLogout hook

- ```tsx

  ```
- import { useLogout } from '@/features/auth/hooks';
-
- function MyComponent() {
- const { logout, isLoading, isLoggedIn } = useLogout();
-
- const handleLogout = async () => {
-     await logout();
- };
-
- if (!isLoggedIn) return null;
-
- return (
-     <button onClick={handleLogout} disabled={isLoading}>
-       {isLoading ? 'Logging out...' : 'Logout'}
-     </button>
- );
- }

- ```

  ```
-

- ### Using useLogoutManager hook (advanced)

- ```tsx

  ```
- import { useLogoutManager } from '@/features/auth/managers/logout.manager';
-
- function AdvancedLogout() {
- const { logoutUser, quickLogout, isPending, canLogout } = useLogoutManager();
-
- // Full logout with API call
- const handleFullLogout = () => logoutUser();
-
- // Quick logout without API call (for offline scenarios)
- const handleQuickLogout = () => quickLogout();
-
- return (
-     <div>
-       <button onClick={handleFullLogout}>Logout</button>
-       <button onClick={handleQuickLogout}>Quick Logout</button>
-     </div>
- );
- }

- ```

  ```
-

- ## Features

-
- - ✅ **API Integration**: Calls `/api/auth/logout` to invalidate tokens on server
- - ✅ **Token Management**: Clears access tokens and refresh tokens from localStorage
- - ✅ **State Management**: Updates Zustand auth store to clear user data
- - ✅ **Navigation**: Automatically redirects to login page after logout
- - ✅ **Error Handling**: Graceful fallback if API call fails
- - ✅ **Loading States**: Shows loading indicators during logout process
- - ✅ **Offline Support**: Quick logout option for offline scenarios
- - ✅ **Type Safety**: Full TypeScript support with proper types
- - ✅ **Reusable Components**: Multiple ways to implement logout UI
- - ✅ **Permission Checking**: Only shows logout options when user is authenticated
-

- ## How it works

-
- 1. User clicks logout button/option
- 2. `logoutUser()` function is called
- 3. Current access and refresh tokens are retrieved from localStorage
- 4. API call is made to `/api/auth/logout` with refresh token
- 5. Server invalidates the tokens (MSW mock handles this in development)
- 6. Local tokens are cleared from localStorage
- 7. Auth store is updated to clear user state
- 8. User is redirected to login page
- 9. If API call fails, local state is still cleared as fallback
-

- ## Integration

-
- The logout functionality is already integrated into:
- - Sidebar user dropdown (NavUser component)
- - Available as standalone components and hooks for other use cases
-
- The existing sidebar will now show a functional "Log out" option in the user dropdown menu.
  \*/

export {}; // Make this a module
