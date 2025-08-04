# SharedAlertDialog Tests

This directory contains comprehensive tests for the SharedAlertDialog component and its associated hook.

## Test Files

### `SharedAlertDialog.test.tsx`

Tests the main SharedAlertDialog component with **22 test cases** covering:

#### Rendering Tests (10 tests)

- ✅ Renders when open is true
- ✅ Does not render when open is false
- ✅ Renders with default title when no title provided
- ✅ Renders with custom title when provided
- ✅ Renders description when provided
- ✅ Does not render description when not provided
- ✅ Renders default button texts when not provided
- ✅ Renders custom button texts when provided
- ✅ Renders children content when provided
- ✅ Does not render children wrapper when no children provided

#### Variant Styling Tests (3 tests)

- ✅ Applies default styling when variant is default
- ✅ Applies destructive styling when variant is destructive
- ✅ Uses default variant when no variant provided

#### Event Handling Tests (4 tests)

- ✅ Calls onConfirm and onOpenChange when confirm button is clicked
- ✅ Calls onCancel and onOpenChange when cancel button is clicked
- ✅ Only calls onOpenChange when onConfirm is not provided
- ✅ Only calls onCancel when onCancel is not provided

#### Integration Scenarios (2 tests)

- ✅ Renders complete dialog with all props
- ✅ Handles multiple button clicks correctly

#### Accessibility Tests (3 tests)

- ✅ Renders title with proper heading structure
- ✅ Renders description with proper paragraph structure
- ✅ Renders buttons with proper button elements

### `useAlertDialog.test.ts`

Tests the useAlertDialog hook with **6 test cases** covering:

#### Basic Functionality

- ✅ Initializes with closed state
- ✅ Opens dialog when showAlert is called
- ✅ Closes dialog when hideAlert is called
- ✅ Sets dialog state directly with setIsOpen

#### Advanced Functionality

- ✅ Provides stable function references (testing useCallback optimization)
- ✅ Handles multiple state changes correctly

## Running Tests

### Run all alert dialog tests:

```bash
npm test -- AlertDialog
```

### Run specific test files:

```bash
# Component tests only
npm test -- SharedAlertDialog.test.tsx

# Hook tests only
npm test -- useAlertDialog.test.ts
```

### Run with coverage:

```bash
npm test -- --coverage AlertDialog
```

## Test Coverage

The tests provide comprehensive coverage of:

- **Component rendering** in all states
- **Props handling** including optional props
- **Event callbacks** for user interactions
- **Styling variants** (default and destructive)
- **Accessibility** concerns
- **Hook state management** and memoization
- **Error scenarios** and edge cases

## Mocking Strategy

The tests use Jest mocks for:

- **shadcn/ui components** - Mocked with simple test-friendly implementations
- **External dependencies** - Isolated to focus on component logic

This ensures tests are:

- ✅ Fast and reliable
- ✅ Focused on component behavior
- ✅ Independent of external UI library implementation details

## Future Test Considerations

Areas for potential test expansion:

- Integration tests with actual shadcn components
- Visual regression tests for styling
- Performance tests for large datasets
- E2E tests in real browser environments
