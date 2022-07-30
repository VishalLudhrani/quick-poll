import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react"
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const Modal = ({
  header,
  footer,
  children,
  className,
  open,
  onClose,
}) => {
  return (
    <Dialog 
      dismiss={{
        enabled: true,
        escapeKey: true,
      }}
      open={open}
      handler={onClose}
      className={" " + className}
    >
      <DialogHeader>
        {header}
      </DialogHeader>
      <DialogBody>
        {children}
      </DialogBody>
      <DialogFooter>
        {footer == null ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          <>
            {footer}
          </>
        )}
      </DialogFooter>
    </Dialog>
  )
}

Modal.defaultProps = {
  footer: null,
  className: "",
}

Modal.propTypes = {
  header: PropTypes.node.isRequired,
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

createPortal(Modal, document.getElementById("modal"));

export default Modal;