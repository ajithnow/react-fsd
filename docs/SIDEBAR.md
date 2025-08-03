# Sidebar Configuration System

The sidebar system now supports dynamic menu items that can be passed from the layout to the sidebar component. This provides flexibility for different features, user roles, and permissions. The system automatically filters navigation items based on user permissions stored from login data.

## Architecture

### Components

- **AppLayout**: Main layout component that accepts `sidebarData` prop
- **AppSidebar**: Sidebar component that receives menu data via props
- **Helper Functions**: Utilities for creating sidebar data structures
- **Permission Filtering**: Automatic filtering of navigation items based on user permissions

### Key Files

- `src/shared/components/AppLayout/AppLayout.tsx` - Layout component
- `src/shared/components/AppSidebar/AppSidebar.tsx` - Sidebar component
- `src/shared/components/AppLayout/sidebarHelpers.ts` - Helper functions
- `src/shared/hooks/useSidebar.ts` - Sidebar hook with configurations and permission filtering

## Features

### Permission-Based Navigation

- Navigation items are automatically filtered based on user permissions
- Permissions are stored during login and used to show/hide menu items
- Admin users see additional navigation items based on their permissions
- Empty navigation groups are automatically hidden

### User Data Integration

- User information is automatically pulled from authentication store
- User avatar, name, and email are displayed in the sidebar
- Real-time updates when user authentication state changes

## Usage Examples

### Basic Usage with Hook

```tsx
import { AppLayout, useSidebarData } from '../shared';

// Using the hook for reactive sidebar data
function MyComponent() {
  const sidebarData = useSidebarData();

  return (
    <AppLayout sidebarData={sidebarData}>
      <YourContent />
    </AppLayout>
  );
}

// Custom sidebar data with options
function MyFeatureComponent() {
  const sidebarData = useSidebarData({
    userRole: 'admin',
    feature: 'customers',
  });

  return (
    <AppLayout sidebarData={sidebarData}>
      <YourContent />
    </AppLayout>
  );
}
```

### Direct Function Usage

```tsx
import { AppLayout, getSidebarData } from '../shared';

// Simple usage with default sidebar
<AppLayout>
  <YourContent />
</AppLayout>;

// Custom sidebar data
const customSidebarData = getSidebarData({
  userRole: 'admin',
  feature: 'customers',
});

<AppLayout sidebarData={customSidebarData}>
  <YourContent />
</AppLayout>;
```

### Creating Custom Sidebar Data

```tsx
import {
  createSidebarData,
  createNavGroup,
  createNavLink,
  createNavCollapsible,
} from '../shared/components';
import { Home, Users, Settings } from 'lucide-react';

const customSidebar = createSidebarData({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  },
  navGroups: [
    createNavGroup('Main', [
      createNavLink('Home', '/', Home),
      createNavLink('Users', '/users', Users),
      createNavCollapsible(
        'Settings',
        [
          { title: 'Profile', url: '/settings/profile' },
          { title: 'Security', url: '/settings/security' },
        ],
        Settings
      ),
    ]),
  ],
});
```

### Feature-Specific Sidebars

```tsx
// Different sidebar for different features
const customersSidebar = getSidebarData({ feature: 'customers' });
const dashboardSidebar = getSidebarData({ feature: 'dashboard' });
const adminSidebar = getSidebarData({ userRole: 'admin' });
```

### Route-Level Configuration

```tsx
import { useSidebarData } from '../shared';

// In your route components
export const CustomerRouteComponent = () => {
  const sidebarData = useSidebarData({ feature: 'customers' });

  return (
    <AppLayout sidebarData={sidebarData}>
      <Outlet />
    </AppLayout>
  );
};

export const AdminRouteComponent = () => {
  const sidebarData = useSidebarData({ userRole: 'admin' });

  return (
    <AppLayout sidebarData={sidebarData}>
      <Outlet />
    </AppLayout>
  );
};
```

## Hook Functions

### `useSidebarData(options)`

React hook that automatically updates sidebar data when auth state changes.

**Parameters:**

- `userRole?`: 'admin' | 'user' - Override user role
- `feature?`: string - Feature-specific sidebar configuration

**Returns:** SidebarData - Complete sidebar configuration

### `getSidebarData(options)`

Direct function to get sidebar data without reactive updates.

**Parameters:**

- `userRole?`: 'admin' | 'user' - Override user role
- `feature?`: string - Feature-specific sidebar configuration
- `customUser?`: ExtendedUser | null - Custom user object

## Helper Functions

### `createSidebarData(options)`

Creates a complete sidebar data structure.

**Parameters:**

- `user`: User information object
- `navGroups`: Array of navigation groups
- `teams?`: Optional teams array

### `createNavGroup(title, items)`

Creates a navigation group.

**Parameters:**

- `title`: Group title
- `items`: Array of navigation items

### `createNavLink(title, url, icon?, badge?)`

Creates a simple navigation link.

**Parameters:**

- `title`: Link title
- `url`: Navigation URL
- `icon?`: Optional Lucide icon component
- `badge?`: Optional badge text

### `createNavCollapsible(title, items, icon?, badge?)`

Creates a collapsible navigation item with sub-items.

**Parameters:**

- `title`: Collapsible title
- `items`: Array of sub-items
- `icon?`: Optional Lucide icon component
- `badge?`: Optional badge text

## Advanced Configurations

### Role-Based Sidebars

```tsx
const getSidebarForUser = user => {
  return getSidebarData({
    userRole: user.role,
    customUser: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};
```

### Context-Aware Sidebars

```tsx
const getSidebarForContext = pathname => {
  if (pathname.startsWith('/admin')) {
    return getSidebarData({ userRole: 'admin' });
  } else if (pathname.startsWith('/customers')) {
    return getSidebarData({ feature: 'customers' });
  }
  return getSidebarData();
};
```

### Dynamic Menu Updates

```tsx
// Update sidebar based on permissions
const getPermissionBasedSidebar = permissions => {
  const baseData = getSidebarData();

  // Filter out items user doesn't have permission for
  const filteredGroups = baseData.navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => hasPermission(permissions, item.url)),
  }));

  return {
    ...baseData,
    navGroups: filteredGroups,
  };
};
```

## Migration Guide

### From Static to Dynamic Sidebar

**Before:**

```tsx
// Sidebar items were hardcoded in the component
<AppSidebar />
```

**After:**

```tsx
// Sidebar items are passed as props
<AppSidebar data={sidebarData} />
// or through AppLayout
<AppLayout sidebarData={sidebarData}>
```

### Updating Existing Routes

1. Import the sidebar configuration functions
2. Create or use existing sidebar data
3. Pass it to AppLayout via the `sidebarData` prop

```tsx
// Old
<AppLayout>
  <Outlet />
</AppLayout>

// New
<AppLayout sidebarData={getSidebarData()}>
  <Outlet />
</AppLayout>
```

## Best Practices

1. **Centralize Configurations**: Keep sidebar configurations in `sidebarConfig.ts`
2. **Use Helper Functions**: Leverage the helper functions for consistency
3. **Type Safety**: Import proper types from the models
4. **Performance**: Memoize sidebar data when appropriate
5. **Accessibility**: Ensure all navigation items have proper labels and icons

## Examples

See `src/features/sidebarConfig.ts` for comprehensive examples of different sidebar configurations including default, admin, and feature-specific sidebars.

# Sidebar Configuration System

The sidebar system now supports dynamic menu items that can be passed from the layout to the sidebar component. This provides flexibility for different features, user roles, and permissions. The system automatically filters navigation items based on user permissions stored from login data.

## Architecture

### Components

- **AppLayout**: Main layout component that accepts `sidebarData` prop
- **AppSidebar**: Sidebar component that receives menu data via props
- **Helper Functions**: Utilities for creating sidebar data structures
- **Permission Filtering**: Automatic filtering of navigation items based on user permissions

### Key Files

- `src/shared/components/AppLayout/AppLayout.tsx` - Layout component
- `src/shared/components/AppSidebar/AppSidebar.tsx` - Sidebar component
- `src/shared/components/AppLayout/sidebarHelpers.ts` - Helper functions
- `src/shared/hooks/useSidebar.ts` - Sidebar hook with configurations and permission filtering

## Features

### Permission-Based Navigation

- Navigation items are automatically filtered based on user permissions
- Permissions are stored during login and used to show/hide menu items
- Admin users see additional navigation items based on their permissions
- Empty navigation groups are automatically hidden

### User Data Integration

- User information is automatically pulled from authentication store
- User avatar, name, and email are displayed in the sidebar
- Real-time updates when user authentication state changes

## Usage Examples

### Basic Usage with Hook

```tsx
import { AppLayout, useSidebarData } from '../shared';

// Using the hook for reactive sidebar data
function MyComponent() {
  const sidebarData = useSidebarData();

  return (
    <AppLayout sidebarData={sidebarData}>
      <YourContent />
    </AppLayout>
  );
}

// Custom sidebar data with options
function MyFeatureComponent() {
  const sidebarData = useSidebarData({
    userRole: 'admin',
    feature: 'customers',
  });

  return (
    <AppLayout sidebarData={sidebarData}>
      <YourContent />
    </AppLayout>
  );
}
```

### Direct Function Usage

```tsx
import { AppLayout, getSidebarData } from '../shared';

// Simple usage with default sidebar
<AppLayout>
  <YourContent />
</AppLayout>;

// Custom sidebar data
const customSidebarData = getSidebarData({
  userRole: 'admin',
  feature: 'customers',
});

<AppLayout sidebarData={customSidebarData}>
  <YourContent />
</AppLayout>;
```

### Creating Custom Sidebar Data

```tsx
import {
  createSidebarData,
  createNavGroup,
  createNavLink,
  createNavCollapsible,
} from '../shared/components';
import { Home, Users, Settings } from 'lucide-react';

const customSidebar = createSidebarData({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  },
  navGroups: [
    createNavGroup('Main', [
      createNavLink('Home', '/', Home),
      createNavLink('Users', '/users', Users),
      createNavCollapsible(
        'Settings',
        [
          { title: 'Profile', url: '/settings/profile' },
          { title: 'Security', url: '/settings/security' },
        ],
        Settings
      ),
    ]),
  ],
});
```

### Feature-Specific Sidebars

```tsx
// Different sidebar for different features
const customersSidebar = getSidebarData({ feature: 'customers' });
const dashboardSidebar = getSidebarData({ feature: 'dashboard' });
const adminSidebar = getSidebarData({ userRole: 'admin' });
```

### Route-Level Configuration

```tsx
import { useSidebarData } from '../shared';

// In your route components
export const CustomerRouteComponent = () => {
  const sidebarData = useSidebarData({ feature: 'customers' });

  return (
    <AppLayout sidebarData={sidebarData}>
      <Outlet />
    </AppLayout>
  );
};

export const AdminRouteComponent = () => {
  const sidebarData = useSidebarData({ userRole: 'admin' });

  return (
    <AppLayout sidebarData={sidebarData}>
      <Outlet />
    </AppLayout>
  );
};
```

## Hook Functions

### `useSidebarData(options)`

React hook that automatically updates sidebar data when auth state changes.

**Parameters:**

- `userRole?`: 'admin' | 'user' - Override user role
- `feature?`: string - Feature-specific sidebar configuration

**Returns:** SidebarData - Complete sidebar configuration

### `getSidebarData(options)`

Direct function to get sidebar data without reactive updates.

**Parameters:**

- `userRole?`: 'admin' | 'user' - Override user role
- `feature?`: string - Feature-specific sidebar configuration
- `customUser?`: ExtendedUser | null - Custom user object

## Helper Functions

### `createSidebarData(options)`

Creates a complete sidebar data structure.

**Parameters:**

- `user`: User information object
- `navGroups`: Array of navigation groups
- `teams?`: Optional teams array

### `createNavGroup(title, items)`

Creates a navigation group.

**Parameters:**

- `title`: Group title
- `items`: Array of navigation items

### `createNavLink(title, url, icon?, badge?)`

Creates a simple navigation link.

**Parameters:**

- `title`: Link title
- `url`: Navigation URL
- `icon?`: Optional Lucide icon component
- `badge?`: Optional badge text

### `createNavCollapsible(title, items, icon?, badge?)`

Creates a collapsible navigation item with sub-items.

**Parameters:**

- `title`: Collapsible title
- `items`: Array of sub-items
- `icon?`: Optional Lucide icon component
- `badge?`: Optional badge text

## Advanced Configurations

### Role-Based Sidebars

```tsx
const getSidebarForUser = user => {
  return getSidebarData({
    userRole: user.role,
    customUser: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};
```

### Context-Aware Sidebars

```tsx
const getSidebarForContext = pathname => {
  if (pathname.startsWith('/admin')) {
    return getSidebarData({ userRole: 'admin' });
  } else if (pathname.startsWith('/customers')) {
    return getSidebarData({ feature: 'customers' });
  }
  return getSidebarData();
};
```

### Dynamic Menu Updates

```tsx
// Update sidebar based on permissions
const getPermissionBasedSidebar = permissions => {
  const baseData = getSidebarData();

  // Filter out items user doesn't have permission for
  const filteredGroups = baseData.navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => hasPermission(permissions, item.url)),
  }));

  return {
    ...baseData,
    navGroups: filteredGroups,
  };
};
```

## Migration Guide

### From Static to Dynamic Sidebar

**Before:**

```tsx
// Sidebar items were hardcoded in the component
<AppSidebar />
```

**After:**

```tsx
// Sidebar items are passed as props
<AppSidebar data={sidebarData} />
// or through AppLayout
<AppLayout sidebarData={sidebarData}>
```

### Updating Existing Routes

1. Import the sidebar configuration functions
2. Create or use existing sidebar data
3. Pass it to AppLayout via the `sidebarData` prop

```tsx
// Old
<AppLayout>
  <Outlet />
</AppLayout>

// New
<AppLayout sidebarData={getSidebarData()}>
  <Outlet />
</AppLayout>
```

## Best Practices

1. **Centralize Configurations**: Keep sidebar configurations in `sidebarConfig.ts`
2. **Use Helper Functions**: Leverage the helper functions for consistency
3. **Type Safety**: Import proper types from the models
4. **Performance**: Memoize sidebar data when appropriate
5. **Accessibility**: Ensure all navigation items have proper labels and icons

## Examples

See `src/features/sidebarConfig.ts` for comprehensive examples of different sidebar configurations including default, admin, and feature-specific sidebars.
