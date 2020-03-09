import { createFormikValidation } from "@lemoncode/fonk-formik";
import { Validators } from "@lemoncode/fonk";
import { rangeNumber } from "@lemoncode/fonk-range-number-validator";

export const validationSchema = {
  field: {
    age: [
      Validators.required,
      {
        validator: rangeNumber,
        customArgs: {
          min: {
            value: 1,
            inclusive: true
          },
          max: {
            value: 101,
            inclusive: true
          }
        }
      }
    ]
  }
};

export const formValidation = createFormikValidation(validationSchema);
