# Button Component

A reusable button component built on top of shadcn/ui that provides additional features for loading states, icons, and enhanced styling.

## Features

- Built on top of shadcn/ui Button component
- Loading state with spinner animation
- Left and right icon support
- Full width option
- All shadcn button variants and sizes supported
- TypeScript support with comprehensive type definitions
- Comprehensive test coverage

## Usage

### Basic Usage

```tsx
import { Button } from '@/shared/components';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

### With Loading State

```tsx
<Button isLoading loadingText="Saving...">
  Save Changes
</Button>
```

### With Icons

```tsx
import { User, Settings } from 'lucide-react';

// Left icon
<Button leftIcon={<User />}>
  Profile
</Button>

// Right icon
<Button rightIcon={<Settings />}>
  Settings
</Button>
```

### Full Width

```tsx
<Button fullWidth>Full Width Button</Button>
```

### Different Variants and Sizes

```tsx
// Variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Link Style</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

## Props

| Prop          | Type                                                                          | Default     | Description                                |
| ------------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| `children`    | `React.ReactNode`                                                             | -           | The content to display inside the button   |
| `isLoading`   | `boolean`                                                                     | `false`     | Whether the button is in a loading state   |
| `loadingText` | `string`                                                                      | -           | Text to display when the button is loading |
| `leftIcon`    | `React.ReactNode`                                                             | -           | Icon to display on the left side           |
| `rightIcon`   | `React.ReactNode`                                                             | -           | Icon to display on the right side          |
| `fullWidth`   | `boolean`                                                                     | `false`     | Whether the button should take full width  |
| `variant`     | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant                       |
| `size`        | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` | Button size                                |
| `asChild`     | `boolean`                                                                     | `false`     | Whether to render as a child component     |
| `disabled`    | `boolean`                                                                     | `false`     | Whether the button is disabled             |
| `className`   | `string`                                                                      | -           | Additional CSS classes                     |

All standard HTML button props are also supported.

## Behavior

- When `isLoading` is true, the button becomes disabled and shows a spinner
- Icons are hidden during loading state
- If `loadingText` is provided, it replaces the button content during loading
- The button is automatically disabled when either `disabled` or `isLoading` is true

## Examples

### Login Form Button

```tsx
<Button
  type="submit"
  isLoading={isSubmitting}
  loadingText="Signing in..."
  fullWidth
>
  Sign In
</Button>
```

### Action Button with Icon

```tsx
<Button variant="outline" leftIcon={<Download />} onClick={handleDownload}>
  Download Report
</Button>
```

### Destructive Action

```tsx
<Button
  variant="destructive"
  isLoading={isDeleting}
  loadingText="Deleting..."
  onClick={handleDelete}
>
  Delete Account
</Button>
```
