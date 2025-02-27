import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import { Button, DialogActions, DialogContent, DialogTitle, ModalClose } from '@mui/joy'
import Divider from '@mui/joy/Divider'
import { WarningRounded } from '@mui/icons-material'

interface ConfirmModalProps {
    open: boolean
    onClose: () => void
    confirm: (deleteItem: (id: string) => void) => void
    action: string
    deleteItemFunction?: (id: string) => void  // Add this prop
}

export default function ConfirmModal(props: ConfirmModalProps) {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <ModalDialog
                color="danger"
                variant="outlined"
            >
                <ModalClose />
                <DialogTitle>
                    <WarningRounded />
                    Confirmation
                </DialogTitle>
                <Divider />
                <DialogContent>Are you sure you want to {props.action}?</DialogContent>
                <DialogActions>
                    <Button
                        variant="solid"
                        onClick={() => {
                            if (props.confirm && props.deleteItemFunction) {
                                props.confirm(props.deleteItemFunction)
                            }
                            props.onClose()
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="plain"
                        onClick={props.onClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}
