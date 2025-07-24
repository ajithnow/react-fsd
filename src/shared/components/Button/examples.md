# Example: Using the Shared Button Component

Here's how you can replace the existing shadcn Button usage in the LoginForm with the new shared Button component:

## Before (using shadcn Button directly)

```tsx
import { Button } from '@/lib/shadcn/components/ui/button';

<Button
  type="submit"
  disabled={isLoading}
  className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:hover:scale-100 rounded-xl ring-0 hover:ring-4 hover:ring-blue-500/20 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
>
  {isLoading ? (
    <>
      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
      {t('login.loadingButton', 'Signing in...')}
    </>
  ) : (
    <span className="relative z-10">{t('login.loginButton', 'Sign In')}</span>
  )}
</Button>;
```

## After (using shared Button component)

```tsx
import { Button } from '@/shared/components';

<Button
  type="submit"
  isLoading={isLoading}
  loadingText={t('login.loadingButton', 'Signing in...')}
  fullWidth
  className="h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:hover:scale-100 rounded-xl ring-0 hover:ring-4 hover:ring-blue-500/20 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
>
  {t('login.loginButton', 'Sign In')}
</Button>;
```

## Benefits

1. **Cleaner code**: No need to manually handle loading states
2. **Consistent behavior**: Loading states are handled consistently across the app
3. **Better maintainability**: Changes to button behavior can be made in one place
4. **Type safety**: Better TypeScript support with custom props
5. **Reusability**: Can be used throughout the application with the same API

## Other Examples

### Simple usage with icon

```tsx
import { User } from 'lucide-react';

<Button leftIcon={<User />}>Profile</Button>;
```

### Different variants

```tsx
// Primary action
<Button variant="default">Save</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Dangerous action
<Button variant="destructive" isLoading={isDeleting}>
  Delete
</Button>
```
