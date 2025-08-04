import * as React from "react"

// Hook for easier usage of alert dialogs
export function useAlertDialog() {
  const [isOpen, setIsOpen] = React.useState(false)

  const showAlert = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const hideAlert = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    showAlert,
    hideAlert,
    setIsOpen,
  }
}
