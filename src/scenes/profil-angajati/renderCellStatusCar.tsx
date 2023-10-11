import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { GridRenderCellParams } from "@mui/x-data-grid";

const renderCellStatus = (params: GridRenderCellParams | string) => {
  var value;
  if (typeof params == "string") {
    value = params;
  } else if (typeof params == "object") {
    value = params.value;
  }

  return (
    <>
      {value === "1" && <CheckCircleIcon color="success" />}
      {value === "0" && <CancelIcon color="warning" />}
    </>
  );
};

export default renderCellStatus;
