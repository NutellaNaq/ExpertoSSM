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

  const status = value?.status;

  return (
    <>
      {status == "completed" && <CheckCircleIcon color="success" />}
      {status == "in progress" && <AccessTimeIcon color="info" />}
      {status == "needs completion" && <CancelIcon color="warning" />}

      {status == undefined && <CancelIcon color="warning" />}
    </>
  );
};

export default renderCellStatus;
