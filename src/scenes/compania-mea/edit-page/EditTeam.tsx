import { useEffect, useState } from "react";
import {
  addMemberToTeam,
  addTeamLeader,
  deleteMemberFromTeam,
  deleteTeamLeader,
  getAllAngajatiAPIRequest,
  getAllTeamLeadersApiRequest,
  getDetailsAboutTeam,
} from "../../../requests/user.request";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

type props = {
  idTeamToEdit: number;
  handleEditTeam: (value: boolean) => void;
};

type MembersAndLeaders = {
  id: number;
  nume: string;
  prenume: string;
  email: string;
  telefon: string;
  departamentul: string;
  functie: string;
  calificarea: string;
  dataAngajarii: string;
  conduceMasinaCompaniei: boolean;
  numarMatricolIntern: string;
  legitimatie: string;
};

type TeamDetails = {
  team_name: string;
  members: MembersAndLeaders[];
  leaders: MembersAndLeaders[];
};

function EditTeam({ idTeamToEdit, handleEditTeam }: props) {
  const [teamDetails, setTeamDetails] = useState<TeamDetails>(
    {} as TeamDetails
  );
  const [teamMembersDetails, setTeamMembersDetails] = useState<
    MembersAndLeaders[]
  >([]);
  const [teamLeadersDetails, setTeamLeadersDetails] = useState<
    MembersAndLeaders[]
  >([]);
  const [rowsToShowAngajati, setRowsToShowAngajati] = useState<
    MembersAndLeaders[]
  >([]);
  const [rowsToShowLeaders, setRowsToShowLeaders] = useState<
    MembersAndLeaders[]
  >([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [allNonMembersNames, setAllNonMembersNames] = useState<string[]>([]);
  const [allNonLeadersNames, setAllNonLeadersNames] = useState<string[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<string | null>("");
  const [selectedMember, setSelectedMember] = useState<string | null>("");

  const handleMemberSelection = (_event: any, newValue: string | null) => {
    setSelectedMember(newValue);
  };

  const handleLeaderSelection = (_event: any, newValue: string | null) => {
    setSelectedLeader(newValue);
  };

  const getAllMembersNames = async () => {
    try {
      const members = await getAllAngajatiAPIRequest();

      if (members instanceof Error) {
        console.log(members);
        return;
      }

      console.log(Object.values(members.angajati));

      return Object.values(members.angajati);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLeadersNames = async () => {
    try {
      const leaders = await getAllTeamLeadersApiRequest();

      if (leaders instanceof Error) {
        console.log(leaders);
        return;
      }

      console.log(Object.values(leaders.teamLeaders));

      return Object.values(leaders.teamLeaders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdaugaMembru = async () => {
    //check if the selected member is included in the non members names
    if (!allNonMembersNames.includes(selectedMember || "")) {
      return;
    }

    //get the angajat id from the selected member and make it a number
    const angajatId = parseInt(selectedMember?.split(" ")[0] || "0");

    await addMemberToTeam(idTeamToEdit, angajatId);

    //update the team details
    await handleApiRequest();

    setSelectedMember("");
    setIsMemberModalOpen(false);
  };

  const handleAdaugaLeader = async () => {
    //check if the selected leader is included in the non leaders names
    if (!allNonLeadersNames.includes(selectedLeader || "")) {
      return;
    }

    //get the angajat id from the selected leader and make it a number
    const angajatId = parseInt(selectedLeader?.split(" ")[0] || "0");

    await addTeamLeader(idTeamToEdit, angajatId);

    //update the team details
    await handleApiRequest();

    setSelectedLeader("");
    setIsLeaderModalOpen(false);
  };

  const handleAllTheLeadersNames = async () => {
    getAllLeadersNames().then((response) => {
      if (response instanceof Error) {
        console.log(response);
        return;
      }

      if (response === undefined) {
        return;
      }

      const leadersNames = response.map((member: any) => {
        return member.id + " - " + member.nume + " " + member.prenume;
      });

      console.log(leadersNames);

      //filter the members that are already in the team
      const leadersInTeam = teamLeadersDetails.map((member) => {
        return member.id + " - " + member.nume + " " + member.prenume;
      });

      console.log(leadersInTeam);

      const nonLeadersNames = leadersNames.filter(
        (member) => !leadersInTeam.includes(member)
      );

      setAllNonLeadersNames(nonLeadersNames);
    });
  };

  const handleAllTheMembersNames = async () => {
    getAllMembersNames().then((response) => {
      if (response instanceof Error) {
        console.log(response);
        return;
      }

      if (response === undefined) {
        return;
      }

      const angajatiNames = response.map((member: any) => {
        return member.id + " - " + member.nume + " " + member.prenume;
      });

      console.log(angajatiNames);

      //filter the members that are already in the team
      const membersInTeam = teamMembersDetails.map((member) => {
        return member.id + " - " + member.nume + " " + member.prenume;
      });

      console.log(membersInTeam);

      const nonMembersNames = angajatiNames.filter(
        (member) => !membersInTeam.includes(member)
      );

      console.log(nonMembersNames);

      setAllNonMembersNames(nonMembersNames);
    });
  };

  const handleApiRequest = async () => {
    try {
      const response = await getDetailsAboutTeam(idTeamToEdit);

      if (response instanceof Error) {
        console.log(response);
        return;
      }

      console.log(response.data);

      setTeamDetails(response.data);
      setTeamMembersDetails(response.data.members);
      setTeamLeadersDetails(response.data.leaders);
      setRowsToShowAngajati(response.data.members);
      setRowsToShowLeaders(response.data.leaders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      await deleteMemberFromTeam(idTeamToEdit, id);

      //update the team details
      await handleApiRequest();

      //update the non members names
      await handleAllTheMembersNames();

      //update the non leaders names
      await handleAllTheLeadersNames();

      setSelectedMember("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLeader = async (id: number) => {
    try {
      await deleteTeamLeader(idTeamToEdit, id);

      //update the team details
      await handleApiRequest();

      //update the non members names
      await handleAllTheMembersNames();

      //update the non leaders names
      await handleAllTheLeadersNames();

      setSelectedLeader("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleApiRequest();

    console.log(allNonMembersNames);
  }, []);

  useEffect(() => {
    handleAllTheMembersNames();
  }, [teamMembersDetails]);

  useEffect(() => {
    handleAllTheLeadersNames();
  }, [teamLeadersDetails]);

  const columnsMembers: GridColDef[] = [
    { field: "nume", headerName: "Nume", width: 120 },
    { field: "prenume", headerName: "Prenume", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefon", headerName: "Telefon", width: 150 },
    { field: "functia", headerName: "Functia", width: 150 },
    {
      field: "action",
      headerName: "Actiune",
      width: 150,
      renderCell: (params) => (
        <IconButton style={{ color: "#df0000" }}>
          <RemoveCircleIcon
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteMember(params.row.id);
            }}
          />
        </IconButton>
      ),
    },
  ];

  const columnsLeaders: GridColDef[] = [
    { field: "nume", headerName: "Nume", width: 120 },
    { field: "prenume", headerName: "Prenume", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefon", headerName: "Telefon", width: 150 },
    { field: "functia", headerName: "Functia", width: 150 },
    {
      field: "action",
      headerName: "Actiune",
      width: 150,
      renderCell: (props) => (
        <IconButton style={{ color: "#df0000" }}>
          <RemoveCircleIcon
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteLeader(props.row.id);
            }}
          />
        </IconButton>
      ),
    },
  ];

  const customMemberToolbar = () => {
    return (
      <div>
        <div className="flex space-between">
          <h1>Membrii Echipei</h1>
          <div>
            <button
              className="green-button"
              onClick={() => setIsMemberModalOpen(true)}
            >
              ADAUGA MEMBRU
            </button>
          </div>
        </div>
        <div
          className="flex row-reverse"
          style={{ height: 0, position: "relative", zIndex: 100 }}
        >
          {isMemberModalOpen && (
            <div className="memberModal">
              <label style={{ textDecoration: "underline" }}>
                Adauga Membru
              </label>
              <div style={{ margin: "0.3rem 0" }}>
                <div>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={allNonMembersNames}
                    sx={{ width: 300 }}
                    value={selectedMember} // Set the selected value
                    onChange={handleMemberSelection} // Handle value change
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} label="Angajat" />
                    )}
                  />
                </div>
                <div
                  className="flex row-reverse"
                  style={{ margin: "1rem 0 0 0 " }}
                >
                  <button
                    className="button-style-1"
                    onClick={() => handleAdaugaMembru()}
                  >
                    Adauga membru
                  </button>
                  <button
                    className="button-style-2"
                    onClick={() => setIsMemberModalOpen(false)}
                  >
                    Anuleaza
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <GridToolbar />
      </div>
    );
  };

  const customLeaderToolbar = () => {
    return (
      <div>
        <div className="flex space-between">
          <h1>Team Leaderi</h1>
          <button
            className="green-button"
            onClick={() => setIsLeaderModalOpen(true)}
          >
            ADAUGA TEAM LEADER
          </button>
        </div>
        <div
          className="flex row-reverse"
          style={{ height: 0, position: "relative", zIndex: 100 }}
        >
          {isLeaderModalOpen && (
            <div className="leaderModal">
              <label style={{ textDecoration: "underline" }}>
                Adauga Leader
              </label>
              <div style={{ margin: "0.3rem 0" }}>
                <div>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={allNonLeadersNames}
                    sx={{ width: 300 }}
                    value={selectedLeader} // Set the selected value
                    onChange={handleLeaderSelection} // Handle value change
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} label="Angajat" />
                    )}
                  />
                </div>
                <div
                  className="flex row-reverse"
                  style={{ margin: "1rem 0 0 0 " }}
                >
                  <button
                    className="button-style-1"
                    onClick={() => handleAdaugaLeader()}
                  >
                    Adauga team leader
                  </button>
                  <button
                    className="button-style-2"
                    onClick={() => setIsLeaderModalOpen(false)}
                  >
                    Anuleaza
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <GridToolbar />
      </div>
    );
  };

  return (
    <div className="editTeam">
      <div
        style={{ display: "flex", justifyContent: "center", margin: "2rem" }}
      >
        <h1>{teamDetails.team_name}</h1>
      </div>
      <div>
        <button onClick={() => handleEditTeam(false)}>Click</button>
      </div>
      <div className="teamEditMembers">
        <DataGrid
          rows={rowsToShowAngajati}
          columns={columnsMembers}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          style={{ maxWidth: "40%" }}
          slots={{ toolbar: customMemberToolbar }}
        />
        <DataGrid
          rows={rowsToShowLeaders}
          columns={columnsLeaders}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          style={{ maxWidth: "40%" }}
          slots={{ toolbar: customLeaderToolbar }}
        />
      </div>
    </div>
  );
}

export default EditTeam;
