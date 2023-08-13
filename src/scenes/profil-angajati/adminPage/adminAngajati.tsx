import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import renderCellStatus from "../../echipa-mea/renderCellStatus";
import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getAllTeamsStatusApiRequest } from "../../../requests/user.request";
import SeeMore from "./components/SeeMore";

type RowValues = {
  id: number;
  name: string;
  numarMembri: number;
  numarLideri: number;
  acteCompletate: number;
  acteNecompletate: number;
  angajati: {
    name: string;
    prenume: string;
    medicinaMuncii: string;
    IIGM: string;
    ILM: string;
    IP: string;
  }[];
};

// type TeamStatus = {
//   teamName: string;
//   angajati: {
//     nume: string;
//     prenume: string;
//     fiseSSMStatus: {
//       medicinaMuncii: string;
//       IIGM: string;
//       ILM: string;
//       IP: string;
//     };
//   }[];
// };

function createData(
  id: number,
  name: string,
  numarMembri: number,
  numarLideri: number,
  acteCompletate: number,
  acteNecompletate: number
) {
  return {
    id,
    name,
    numarMembri,
    numarLideri,
    acteCompletate,
    acteNecompletate,
    angajati: [
      {
        name: "Lucian",
        prenume: "Dascalul",
        medicinaMuncii: "needs completion",
        IIGM: "completed",
        ILM: "completed",
        IP: "completed",
      },
      {
        name: "Marius",
        prenume: "Marin",
        medicinaMuncii: "completed",
        IIGM: "completed",
        ILM: "completed",
        IP: "completed",
      },
    ],
  };
}

function Row(props: {
  row: ReturnType<typeof createData>;

  handleTeamData: (ids: number, teamName: string) => void;
}) {
  const { row, handleTeamData } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.numarMembri}</TableCell>
        <TableCell align="right">{row.numarLideri}</TableCell>
        <TableCell align="right" style={{ color: "green" }}>
          {row.acteCompletate}
        </TableCell>
        <TableCell align="right" style={{ color: "red" }}>
          {row.acteNecompletate}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 700 }}>Nume</TableCell>
                    <TableCell style={{ fontWeight: 700 }}>Prenume</TableCell>
                    <TableCell align="right" style={{ fontWeight: 700 }}>
                      Medicina Muncii
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 700 }}>
                      IIGM
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 700 }}>
                      ILM
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 700 }}>
                      IP
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.angajati.map((historyRow) => (
                    <TableRow key={historyRow.name}>
                      <TableCell component="th" scope="row">
                        {historyRow.name}
                      </TableCell>
                      <TableCell>{historyRow.prenume}</TableCell>
                      <TableCell align="right">
                        {renderCellStatus(historyRow.medicinaMuncii)}
                      </TableCell>
                      <TableCell align="right">
                        {renderCellStatus(historyRow.IIGM)}
                      </TableCell>
                      <TableCell align="right">
                        {renderCellStatus(historyRow.ILM)}
                      </TableCell>
                      <TableCell align="right">
                        {renderCellStatus(historyRow.IP)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <Typography variant="h6" gutterBottom component="div">
                    <button onClick={() => handleTeamData(row.id, row.name)}>
                      See More
                    </button>
                  </Typography>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// var rows = [
//   createData("Echipa 1", 2, 1, 5, 1),
//   createData("Echipa 2", 2, 1, 5, 1),
// ];

type CreateRows = () => Promise<RowValues[]>;

//This function is exported to EchipaMea.tsx and is used to create the date there so it can be used in the table
export const createRows: CreateRows = () => {
  return new Promise<RowValues[]>(async (resolve, reject) => {
    const rows: RowValues[] = [];

    try {
      const teamValues = await getAllTeamsStatusApiRequest();

      if (teamValues) {
        console.log(teamValues);

        teamValues.TeamsInfo.forEach((team: any) => {
          const idTeam = team?.teamId;
          const nameTeam = team?.teamName;
          let numberOfMembers = 0;
          let numberOfCompletedDocuments = 0;
          let numberOfUncompletedDocuments = 0;
          const arrayOfAngajati = team?.angajati;

          if (arrayOfAngajati) {
            for (const angajatKey in arrayOfAngajati) {
              if (Object.hasOwnProperty.call(arrayOfAngajati, angajatKey)) {
                numberOfMembers++;
                const angajat = arrayOfAngajati[angajatKey];
                const angajatName = angajat?.nume;
                const angajatPrenume = angajat?.prenume;
                const angajatFiseSSMStatus = angajat?.fiseSSMStatus;

                for (const angajatFiseSSMStatusKey in angajatFiseSSMStatus) {
                  if (
                    angajatFiseSSMStatus[angajatFiseSSMStatusKey] ===
                    "completed"
                  ) {
                    numberOfCompletedDocuments++;
                  } else {
                    numberOfUncompletedDocuments++;
                  }
                }

                const row = {
                  id: idTeam,
                  name: nameTeam,
                  numarMembri: numberOfMembers,
                  numarLideri: 1,
                  acteCompletate: numberOfCompletedDocuments,
                  acteNecompletate: numberOfUncompletedDocuments,
                  angajati: [
                    {
                      name: angajatName,
                      prenume: angajatPrenume,
                      medicinaMuncii: angajatFiseSSMStatus[0],
                      IIGM: angajatFiseSSMStatus[1],
                      ILM: angajatFiseSSMStatus[2],
                      IP: angajatFiseSSMStatus[3],
                    },
                  ],
                };

                rows.push(row);
              }
            }
          }
        });

        console.log(rows);

        resolve(rows); // Resolve the promise with the populated rows array
      } else {
        resolve([]); // Resolve the promise with an empty array as a default value if teamValues is falsy
      }
    } catch (error) {
      console.error("Error fetching team values:", error);
      reject(error); // Reject the promise with the error if an error occurs during fetching
    }
  });
};

type CollapsibleTableProps = {
  teamData: any[]; // Replace 'any[]' with the appropriate type of your team data
  seeMore: boolean;
  handleSeeMore: (value: boolean) => void;
};

export default function TeamTable({
  teamData,
  seeMore,
  handleSeeMore,
}: CollapsibleTableProps) {
  const [rowsForShowing, setRowsForShowing] = useState([] as RowValues[]);

  useEffect(() => {
    console.log("useEffect");
    setRowsForShowing(teamData);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [idTeamOfSeeMore, setIdTeamOfSeeMore] = useState(0);
  const [teamName, setTeamName] = useState("22");

  const handleTeamData = (ids: number, teamName: string) => {
    handleSeeMore(true);
    handleSetIdTeamOfSeeMore(ids);
    handleSetTeamName(teamName);
  };

  const handleSetIdTeamOfSeeMore = (value: number) => {
    setIdTeamOfSeeMore(value);
  };

  const handleSetTeamName = (value: string) => {
    setTeamName(value);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm !== "") {
      const filterRows = (rows: RowValues[]) => {
        return rows.filter((row) => {
          //check if the serach term is in first name starting with the first letter
          if (row.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            return true;
          }
        });
      };
      setRowsForShowing(filterRows(teamData));
    } else {
      setRowsForShowing(teamData);
    }
  }, [searchTerm]);

  console.log(rowsForShowing);

  return (
    <>
      {seeMore ? (
        <>
          <SeeMore
            teamName={teamName}
            idTeamOfSeeMore={idTeamOfSeeMore}
            handleSeeMore={handleSeeMore}
          />
        </>
      ) : (
        <div>
          <div style={{ margin: "2rem" }}>
            <Paper component="form" className="transparent">
              <SearchIcon />
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(e) => {
                  handleSearchInputChange(e.target.value);
                }}
              />
            </Paper>
          </div>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Nume echipa</TableCell>
                  <TableCell align="right">Numar membri</TableCell>
                  <TableCell align="right">Numar de lideri</TableCell>
                  <TableCell align="right">Acte completate</TableCell>
                  <TableCell align="right">
                    Acte ce necesita completare
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsForShowing.map((row) => (
                  <Row
                    key={row.name}
                    row={row}
                    handleTeamData={handleTeamData}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}
