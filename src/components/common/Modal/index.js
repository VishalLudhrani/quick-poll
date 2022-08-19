import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import PropTypes from "prop-types";

const Modal = ({
  open,
  onClose,
  title,
  actions,
  children,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      {title && (
        <DialogTitle>{title}</DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions ?? (
          <Button onClick={onClose} sx={{ textTransform: "capitalize" }}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

Modal.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.element,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default Modal;