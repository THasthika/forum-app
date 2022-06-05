import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';

const DeleteConfirmationDialog = ({
  data,
  open,
  onClose,
  onConfirm,
  messageFunc,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>{messageFunc(data)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => onConfirm(data)}>
          Delete
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
