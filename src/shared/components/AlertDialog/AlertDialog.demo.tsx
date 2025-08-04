import { SharedAlertDialog, useAlertDialog } from "../index"
import { Button } from "../Button"

export function AlertDialogDemo() {
  const { isOpen, showAlert, hideAlert } = useAlertDialog()
  const {
    isOpen: isDestructiveOpen,
    showAlert: showDestructiveAlert,
    hideAlert: hideDestructiveAlert,
  } = useAlertDialog()

  const handleConfirm = () => {
    console.log("Confirmed!")
  }

  const handleDestructiveConfirm = () => {
    console.log("Destructive action confirmed!")
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Alert Dialog Examples</h2>
      
      <div className="space-x-4">
        <Button onClick={showAlert}>
          Show Default Alert
        </Button>
        
        <Button 
          onClick={showDestructiveAlert}
          variant="destructive"
        >
          Show Destructive Alert
        </Button>
      </div>

      {/* Default Alert Dialog */}
      <SharedAlertDialog
        open={isOpen}
        onOpenChange={hideAlert}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        confirmText="Yes, delete account"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant="destructive"
      />

      {/* Destructive Alert Dialog with custom content */}
      <SharedAlertDialog
        open={isDestructiveOpen}
        onOpenChange={hideDestructiveAlert}
        title="Delete Project"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDestructiveConfirm}
        variant="destructive"
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this project? This action cannot be undone.
          </p>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">Project: My Important Project</p>
            <p className="text-xs text-muted-foreground">Created: January 1, 2024</p>
          </div>
        </div>
      </SharedAlertDialog>
    </div>
  )
}
