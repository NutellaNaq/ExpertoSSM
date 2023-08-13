import { useEffect, useState } from "react";
import {
  addMemberToTeam,
  getAllAngajatiAPIRequest,
  getDetailsAboutTeam,
} from "../../../requests/user.request";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete, TextField } from "@mui/material";

type props = {
  idTeamToEdit: number;
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

function EditTeam({ idTeamToEdit }: props) {
  const [teamDetails, setTeamDetails] = useState<TeamDetails>(
    {} as TeamDetails
  );
  const [rowsToShowAngajati, setRowsToShowAngajati] = useState<
    MembersAndLeaders[]
  >([]);
  const [rowsToShowLeaders, setRowsToShowLeaders] = useState<
    MembersAndLeaders[]
  >([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [allMembersNames, setAllMembersNames] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>("");

  const handleMemberSelection = (_event: any, newValue: string | null) => {
    setSelectedMember(newValue);
  };

  const getAllMembersNames = async () => {
    try {
      const members = await getAllAngajatiAPIRequest();

      if (members instanceof Error) {
        console.log(members);
        return;
      }

      return Object.values(members.angajati);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdaugaMembru = async () => {
    //get the angajat id from the selected member and make it a number
    const angajatId = parseInt(selectedMember?.split(" ")[0] || "0");

    await addMemberToTeam(idTeamToEdit, angajatId);
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

      const membersNames = response.map((member: any) => {
        return member.id + " - " + member.nume + " " + member.prenume;
      });

      setAllMembersNames(membersNames);
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
      setRowsToShowAngajati(response.data.members);
      setRowsToShowLeaders(response.data.leaders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleApiRequest();
    handleAllTheMembersNames();
    console.log(allMembersNames);
  }, []);

  const columns = [
    { field: "nume", headerName: "Nume", width: 120 },
    { field: "prenume", headerName: "Prenume", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefon", headerName: "Telefon", width: 150 },
    { field: "functia", headerName: "Functia", width: 150 },
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
                    options={allMembersNames}
                    sx={{ width: 300 }}
                    value={selectedMember} // Set the selected value
                    onChange={handleMemberSelection} // Handle value change
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} label="Movie" />
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
          <button className="green-button">ADAUGA TEAM LEADER</button>
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
      <div className="teamEditMembers">
        <DataGrid
          rows={rowsToShowAngajati}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          style={{ maxWidth: "50%" }}
          slots={{ toolbar: customMemberToolbar }}
        />
        <DataGrid
          rows={rowsToShowLeaders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          style={{ maxWidth: "35%" }}
          slots={{ toolbar: customLeaderToolbar }}
        />
      </div>
    </div>
  );
}

export default EditTeam;
