import React from 'react';
import MaterialTextField from '@material-ui/core/TextField';

// interface NumberFormatCustomProps {
//   inputRef: (instance: NumberFormat | null) => void;
//   onChange: (event: { target: { value: string } }) => void;
// }

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    marginTop: "0.5rem",
    "&:last-of-type": {
      marginLeft: "1rem"
    }
  },
  input: {
    height: "100%"
  }
});

export const TextField = props => {
  const { label, meta, fullWidth, ...rest } = props;
  const hasError = meta.error && meta.touched;
  const classes = useStyles();

  return (
    <MaterialTextField
      {...rest}
      className={classes.container}
      InputProps={{
        classes: {
          root: classes.input
        }
        /*inputComponent: NumberFormatCustom /*as any*/
      }}
      label={label}
      error={hasError}
      helperText={hasError ? meta.error : ""}
      fullWidth={false}
    />
  );
};

TextField.defaultProps = {
  fullWidth: true,
};
