import React from "react";
import { Field, Formik } from "formik";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { formValidation } from "./../../utils/form-validation";
import { TextField } from "./components";
import { makeStyles, createStyles, Grid, IconButton } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

const useStyles = makeStyles((theme /*: Theme*/) =>
  createStyles({
    container: {
      marginTop: "0.5rem",
      "&:last-of-type": {
        marginLeft: "1rem"
      }
    },
    input: {
      height: "100%"
    },
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
    },
    gridInputItem: {
      flexBasis: "20%"
    },
    gridArrowsItem: {
      flexBasis: "0%"
    },
    inputDiv: {
      paddingTop: "7%"
    },
    grid: {
      paddingLeft: "42%"
    }
  })
);

const FormikNumberPicker2 = ({ onSubmit }) => {
  const classes = useStyles();

  return (
    <div>
      <Formik
        onSubmit={values => {
          onSubmit(values.age);
        }}
        validateOnChange
        validate={values => formValidation.validateForm(values)}
        enableReinitialize
        initialValues={{
          age: 0
        }}
      >
        {props => {
          const {
            errors,
            handleSubmit,
            isValid,
            setFieldValue,
            values,
            setFieldTouched
          } = props;

          const increaseHandler = () => {
            setFieldValue("age", parseInt(values.age) + 1, true);
            setFieldTouched("age", true, true);
          };

          const decreaseHandler = () => {
            setFieldValue("age", parseInt(values.age) - 1, true);
            setFieldTouched("age", true, true);
          };

          return (
            <>
              <Typography>Age:</Typography>
              <Grid container spacing={3} className={classes.grid}>
                <Grid className={classes.gridInputItem} item xs={6}>
                  <Field name="age" type="number">
                    {({ field, meta }) => (
                      <div className={"amount-field " + classes.inputDiv}>
                        <TextField {...field} meta={meta} />
                      </div>
                    )}
                  </Field>
                </Grid>
                <Grid item className={classes.gridArrowsItem} xs={6}>
                  <IconButton aria-label="increase" onClick={increaseHandler}>
                    <ArrowDropUpIcon />
                  </IconButton>
                  <IconButton aria-label="decrease" onClick={decreaseHandler}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {errors.recordErrors && errors.recordErrors.integerAmount && (
                <span>{errors.recordErrors.integerAmount}</span>
              )}

              <div className="buttons">
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={!isValid}
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormikNumberPicker2;
