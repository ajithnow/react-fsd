# Shared Alert Dialog

A reusable alert dialog component built on top of shadcn/ui's AlertDialog primitive.

## Components

- `SharedAlertDialog` - A high-level wrapper component for easy alert dialog usage
- `useAlertDialog` - A custom hook for managing alert dialog state
- Raw shadcn components - All the underlying AlertDialog primitives are also exported

## Basic Usage

```tsx
import { SharedAlertDialog, useAlertDialog } from '@/shared/components';

function MyComponent() {
  const { isOpen, showAlert, hideAlert } = useAlertDialog();

  const handleDelete = () => {
    console.log('Item deleted!');
  };

  return (
    <>
      <button onClick={showAlert}>Delete Item</button>

      <SharedAlertDialog
        open={isOpen}
        onOpenChange={hideAlert}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
```

## Props

### SharedAlertDialog

| Prop           | Type                         | Default         | Description                                 |
| -------------- | ---------------------------- | --------------- | ------------------------------------------- |
| `open`         | `boolean`                    | -               | Controls whether the dialog is open         |
| `onOpenChange` | `(open: boolean) => void`    | -               | Callback when dialog open state changes     |
| `title`        | `string`                     | "Are you sure?" | Dialog title                                |
| `description`  | `string`                     | -               | Dialog description text                     |
| `confirmText`  | `string`                     | "Continue"      | Text for confirm button                     |
| `cancelText`   | `string`                     | "Cancel"        | Text for cancel button                      |
| `onConfirm`    | `() => void`                 | -               | Callback when confirm button is clicked     |
| `onCancel`     | `() => void`                 | -               | Callback when cancel button is clicked      |
| `variant`      | `"default" \| "destructive"` | "default"       | Visual variant of the confirm button        |
| `children`     | `React.ReactNode`            | -               | Custom content to render in the dialog body |

### useAlertDialog Hook

Returns an object with:

- `isOpen` - Current open state
- `showAlert` - Function to show the dialog
- `hideAlert` - Function to hide the dialog
- `setIsOpen` - Direct state setter for advanced usage

## Advanced Usage

### Custom Content

```tsx
<SharedAlertDialog
  open={isOpen}
  onOpenChange={hideAlert}
  title="Delete Project"
  onConfirm={handleDelete}
  variant="destructive"
>
  <div className="space-y-2">
    <p>This will permanently delete:</p>
    <ul className="list-disc list-inside text-sm text-muted-foreground">
      <li>All project files</li>
      <li>Associated data</li>
      <li>Backup copies</li>
    </ul>
  </div>
</SharedAlertDialog>
```

### Using Raw Components

For more control, you can use the underlying shadcn components directly:

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components';

function CustomAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Custom Dialog</AlertDialogTitle>
          <AlertDialogDescription>Custom description</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Examples

See `AlertDialog.demo.tsx` for complete usage examples.
