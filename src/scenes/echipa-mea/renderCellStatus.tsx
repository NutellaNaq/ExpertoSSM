import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import { GridRenderCellParams } from "@mui/x-data-grid";

const renderCellStatus = (params: GridRenderCellParams | string) => {
  var value;
  if (typeof params == "string") {
    value = params;
  } else if (typeof params == "object") {
    value = params.value;
  }
  console.log(typeof params);
  console.log("value: ", value);
  return (
    <>
      {value === "completed" && <CheckCircleIcon color="success" />}
      {value === "in progress" && <AccessTimeIcon color="info" />}
      {value === "needs completion" && <CancelIcon color="warning" />}
    </>
  );
};

export default renderCellStatus;