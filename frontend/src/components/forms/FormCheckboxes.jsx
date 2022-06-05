import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';

const FormCheckboxes = ({
  control,
  name,
  options,
  valueName = 'key',
  labelName = 'value',
  ...props
}) => {
  const optionEls = useMemo(() => {
    return options.map((opt) => (
      <FormControlLabel
        key={opt[valueName]}
        control={
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              const vArr = field.value.map((v) => v.name);
              return (
                <Checkbox
                  {...field}
                  {...props}
                  checked={vArr.indexOf(opt[valueName]) !== -1}
                  onChange={(e) => {
                    const ix = vArr.indexOf(opt[valueName]);
                    if (ix === -1) {
                      let x = field.value;
                      x.push(opt);
                      field.onChange(x);
                    } else {
                      let x = field.value;
                      x.splice(ix, 1);
                      field.onChange(x);
                    }
                  }}
                />
              );
            }}
          />
        }
        label={opt[labelName]}
      />
    ));
  }, [control, labelName, name, options, props, valueName]);

  return <FormGroup>{optionEls}</FormGroup>;
};

export default FormCheckboxes;
