import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import axios from "axios";

import NumberPicker2 from "../NumberPicker2/index.jsx";

const AgeMain = () => {
  const [price, setPrice] = React.useState(null);

  const makeRequest = async age => {
    await axios
      .get(
        `https://ykf45oytvf.execute-api.us-east-1.amazonaws.com/dv/quad-bikes/calc/price/${age}`
      )
      .then(response => {
        setPrice(response.data.price)
        // handle success
        //console.log(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  };

  return (
    <Container>
      <NumberPicker2 onSubmit={makeRequest} />
      {price !== null ? <Typography>Price is {price}</Typography> : null}
    </Container>
  );
};

export default AgeMain;
