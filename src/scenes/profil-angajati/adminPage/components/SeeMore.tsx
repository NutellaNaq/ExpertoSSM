import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import renderCellTrue from "../../../echipa-mea/renderCellStatus";
import { getTeamMembersSSMStatusApiRequest } from "../../../../requests/user.request";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

type AngajatiStatus = {
  id: number;
  nume: string;
  prenume: string;
  fiseSSMStatus: string[];
};

type StatusAngajatiTable = {
  id: number;
  nume: string;
  prenume: string;
  medicinaMuncii: string;
  IIGM: string;
  ILM: string;
  IP: string;
};

type Props = {
  teamName: string;
  idTeamOfSeeMore: number;
  handleSeeMore: (value: boolean) => void;
  handleSetSectiuneEchipaMea: (value: string) => void;
};

const SeeMore = ({
  teamName,
  idTeamOfSeeMore,
  handleSeeMore,
  handleSetSectiuneEchipaMea,
}: Props) => {
  const [rowsOfMembers, setRowsOfMembers] = useState<StatusAngajatiTable[]>([]);

  const handleTheSection = (value: string) => {
    handleSeeMore(false);
    handleSetSectiuneEchipaMea(value);
  };

  const handleRows = async (row: any) => {
    console.log(row);
    const rowsToSet = row.map((element: any) => {
      const fiseSSMStatus = element.fiseSSMStatus.map((fisa: any) => {
        return fisa;
      });

      return {
        id: element.id,
        nume: element.last_name,
        prenume: element.first_name,
        medicinaMuncii: fiseSSMStatus[0],
        IIGM: fiseSSMStatus[1],
        ILM: fiseSSMStatus[2],
        IP: fiseSSMStatus[3],
      };
    });

    setRowsOfMembers(rowsToSet);
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      try {
        const response = await getTeamMembersSSMStatusApiRequest(
          idTeamOfSeeMore
        );

        if (response instanceof Error) {
          console.log(response);
          return;
        }

        const rowToHandle: AngajatiStatus = response.teamMembersSSMStatus;

        handleRows(rowToHandle);
      } catch (error) {
        console.log(error);
      }
    };

    handleApiRequest();

    console.log(rowsOfMembers);

    console.log(teamName);
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nume", headerName: "Nume", width: 270 },
    { field: "prenume", headerName: "Prenume", width: 270 },
    {
      field: "medicinaMuncii",
      headerName: "Medicina Muncii",
      width: 270,
      renderCell: renderCellTrue,
    },
    {
      field: "IIGM",
      headerName: "IIGM",
      width: 270,
      renderCell: renderCellTrue,
    },
    {
      field: "ILM",
      headerName: "ILM",
      width: 270,
      renderCell: renderCellTrue,
    },
    {
      field: "IP",
      headerName: "IP",
      width: 270,
      renderCell: renderCellTrue,
    },
  ];

  return (
    <div>
      <div className="flex justify-content-center" style={{ margin: "4rem" }}>
        <h1>{teamName}</h1>
      </div>

      <div className="flex" style={{ margin: "0 2rem" }}>
        <button className="back-button" onClick={() => handleSeeMore(false)}>
          <KeyboardBackspaceIcon />
        </button>
        <button
          className="button-style-1"
          style={{ margin: "0 1rem" }}
          type="button"
          onClick={() => handleTheSection("Echipe")}
        >
          Echipe
        </button>
      </div>
      <DataGrid
        rows={rowsOfMembers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
};

export default SeeMore;
