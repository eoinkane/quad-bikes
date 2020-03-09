import React, { ReactElement } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import { makeStyles, createStyles, Button } from "@material-ui/core";
import clsx from "clsx";

/*
interface data {
  child: {
    minimumAge: number;
    maximumAge: number;
    price: number;
  };
  teenager: {
    minimumAge: number;
    maximumAge: number;
    price: number;
  };
  adult: {
    minimumAge: number;
    maximumAge: number;
    price: number;
  };
  consession: {
    minimumAge: number;
    maximumAge: number;
    price: number;
  };
}

export interface EditPricesComponentProps {}

export interface EditPricesComponentState {
  data: data | null;
  position: string;
}

*/
const useStyles = makeStyles(() =>
  createStyles({
    editArea: {
      textAlign: "left"
    }
  })
);

class EditPricesComponent extends React.Component /*<
  EditPricesComponentProps,
  EditPricesComponentState
>*/ {
  state = { data: null, position: "loading" };

  async componentDidMount() {
    await axios
      .get(
        "https://ykf45oytvf.execute-api.us-east-1.amazonaws.com/dv/quad-bikes/get/prices"
      )
      .then(response => {
        this.setState({ data: response.data, position: "editing" });
        // handle success
        console.log(response.data);
      })
      .catch(error => {
        // handle error
        this.setState({ position: "error" });
        console.log(error);
      });
  }

  render() {
    let displayComponent;
    switch (this.state.position) {
      case "loading":
        displayComponent = <p>Loading</p>;
        break;
      case "editing":
        displayComponent = (
          <div style={{ textAlign: "left" }}>
            {" "}
            <ReactJson
              src={this.state.data}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={false}
              onEdit={edit => {
                console.log(typeof edit.new_value);
                console.log(edit.updated_src);
                if (edit.name !== "price") {
                  alert("You can only edit the price currently");
                  return false;
                } else if ((typeof (parseInt(edit.new_value))) !== typeof 10) {
                  alert("You can only input a number");
                  return false;
                } else {
                  let valid;
                  try {
                    const numberStore = parseInt(edit.new_value);
                    valid = true;
                  } catch (error) {
                    valid = false;
                  }
                  if (valid) {
                    this.setState({ data: edit.updated_src });
                    return true;
                  } else {
                    return false;
                  }
                }
              }}
            />
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={() => {
                axios
                  .post(
                    "https://ykf45oytvf.execute-api.us-east-1.amazonaws.com/dv/quad-bikes/edit/prices",
                    JSON.stringify(this.state.data)
                  )
                  .then(() => {
                    this.setState({ position: "posting succeeded" });
                  })
                  .catch(() => {
                    this.setState({ position: "posting failed" });
                  });
              }}
            >
              Submit
            </Button>
          </div>
        );
        break;
      case "posting succeeded":
        displayComponent = <p>Data Saved Successfully</p>;
        break;
      case "posting failed":
        displayComponent = <p>Data Was Not Saved Successfully</p>;
        break;
      default:
        displayComponent = <p>Default</p>;
        break;
    }
    return (
      <>
        <p>Edit Page</p>
        {displayComponent}
      </>
    );
  }
}

const EditPricesComponentOld /*: React.SFC<EditPricesComponentProps> */ = () => {
  const [data, setData] = React.useState(/*<null | data>*/ null);

  let displayComponent = <p>Loading</p>;

  React.useEffect(() => {
    (async () => {
      await axios
        .get(
          "https://ykf45oytvf.execute-api.us-east-1.amazonaws.com/dv/quad-bikes/get/prices"
        )
        .then(response => {
          setData(response.data);
          // handle success
          //displayComponent = <ReactJson src={response.data} />;
          console.log(response.data);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    })();
  }, []);
  return <>{() => displayComponent}</>;
};

export default EditPricesComponent;
