import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { getListOfTeamsApiRequest } from "../../../requests/user.request";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import EditTeam from "../edit-page/EditTeam";

type RowToShow = {
  id: number;
  name: string;
  members: string;
  leaders: string;
};

const handleListOfTeamsRequest = async () => {
  const response = await getListOfTeamsApiRequest();

  if (response instanceof Error) {
    return []; // Return an empty array if there's an error
  }

  // Assuming response is an array of team data, transform it into RowToShow format
  const transformedData: RowToShow[] = response.map((team: RowToShow) => {
    console.log(team);
    return {
      id: team.id,
      name: team.name,
      members: team.members,
      leaders: team.leaders,
    };
  });

  console.log(transformedData);

  return transformedData;
};

function ListTeams() {
  const [rowsToShow, setRowsToShow] = useState<RowToShow[]>([]);
  const [editTeam, setEditTeam] = useState<boolean>(false);
  const [idTeamToEdit, setIdTeamToEdit] = useState<number>(0);

  const handleEditTeam = (value: boolean) => {
    setEditTeam(value);
  };

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton color="primary">
            <EditIcon
              onClick={(event) => {
                event.stopPropagation();
                setIdTeamToEdit(params.row.id);
                handleEditTeam(true);
              }}
            />
          </IconButton>
        </div>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nume", width: 270 },
    { field: "members", headerName: "Membri", width: 270 },
    { field: "leaders", headerName: "TeamLeaders", width: 270 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleListOfTeamsRequest();
      setRowsToShow(data);
      console.log(rowsToShow);
    };

    fetchData();
  }, []);

  return (
    <div className="listTeams">
      {editTeam ? (
        <EditTeam idTeamToEdit={idTeamToEdit} />
      ) : (
        <DataGrid
          rows={rowsToShow}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      )}
    </div>
  );
}

export default ListTeams;
