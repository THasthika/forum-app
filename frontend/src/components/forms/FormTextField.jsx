import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const FormTextField = ({ control, name, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <TextField {...field} {...props} />}
    />
  );
};

export default FormTextField;
