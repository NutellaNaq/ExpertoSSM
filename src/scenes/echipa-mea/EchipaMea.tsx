import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import renderCellTrue from "./renderCellStatus";
import { getAllAngajatiStatusApiRequest } from "../../requests/user.request";
import { FormControlLabel, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TeamTable, {
  createRows,
} from "../profil-angajati/adminPage/adminAngajati";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

type AngajatTable = Angajat & {
  id: number;
};

type Angajat = {
  nume: string;
  prenume: string;
  legitimatie: string;
  grupaSanguina: string;
  domiciliu: string;
  dataNasterii: string;
  loculNasterii: string;
  calificarea: string;
  functia: string;
  email: string;
  telefon: string;
  departamentul: string;
  numarMatricolIntern: string;
  dataAngajarii: string;
  conduceMasinaCompaniei: boolean;
};

type AngajatFisaSSM = {
  id: number;
  nume: string;
  prenume: string;
  medicinaMuncii: string;
  IIGM: string;
  ILM: string;
  IP: string;
};

type AngajatiStatus = {
  id: number;
  nume: string;
  prenume: string;
  fiseSSMStatus: string[];
};

function EchipaMea() {
  const [rows, setRows] = useState([] as AngajatFisaSSM[]);

  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [filteredRowsTable, setFilteredRowsTable] = useState<AngajatFisaSSM[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [sectiuneEchipaMea, setSectiuneEchipaMea] = useState("angajati");

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm !== "") {
      const filterRows = (rows: AngajatFisaSSM[]) => {
        return rows.filter((row) => {
          //check if the serach term is in first name starting with the first letter
          if (row.nume.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            return true;
          }
        });
      };

      console.log(filterRows(rows));

      setFilteredRowsTable(filterRows(rows));
    } else {
      setFilteredRowsTable(rows);
    }
  }, [searchTerm]);
  //   const getAngajatiInfo = await getAllAngajatiAPIRequest();

  //   if (getAngajatiInfo.error) {
  //     return [];
  //   }

  //   console.log(getAngajatiInfo);
  //   const angajatiArray: AngajatTable[] = Object.values(
  //     getAngajatiInfo.angajati
  //   );

  //   return angajatiArray;
  // };

  // const fetchAngajati = async () => {
  //   const angajatiArray = await getAngajati();
  //   const angajatNames = angajatiArray.map((angajat: AngajatTable) => {
  //     return {
  //       id: angajat.id,
  //       nume: angajat.nume,
  //       prenume: angajat.prenume,
  //     };
  //   });

  //   return Object.values(angajatNames);
  // };

  // const fetchFisaSSM = async (id: number) => {
  //   const fisaSSM = await getFisaSSMByIdAPIRequest(id);

  //   if (fisaSSM.error) {
  //     return [];
  //   }

  //   return Object.values(fisaSSM.status);
  // };

  const setTheColumns = () => {
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

    setColumns(columns);
  };

  const getFiseArray = async () => {
    try {
      const angajatiDataStatus = await getAllAngajatiStatusApiRequest();

      const angajatiDataStatusValue: AngajatiStatus[] =
        Object.values(angajatiDataStatus);

      const rowTableStatusData = angajatiDataStatusValue.map(
        (element: AngajatiStatus) => {
          const medicinaMuncii = element.fiseSSMStatus[0];
          const IIGM = element.fiseSSMStatus[1];
          const ILM = element.fiseSSMStatus[2];
          const IP = element.fiseSSMStatus[3];

          return {
            id: element.id,
            nume: element.nume,
            prenume: element.prenume,
            medicinaMuncii: medicinaMuncii,
            IIGM: IIGM,
            ILM: ILM,
            IP: IP,
          };
        }
      );

      setRows(rowTableStatusData);
      setFilteredRowsTable(rowTableStatusData);

      setLoading(false);
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const [teamData, setTeamData] = useState([] as any[]);

  useEffect(() => {
    setTheColumns();
    getFiseArray();
    const fetchData = async () => {
      const rowsToShow = await createRows();
      setTeamData(rowsToShow);
    };
    fetchData();
  }, []);

  const empty: AngajatTable[] = [];

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="${encodeURIComponent(
            "#fff"
          )}" width="25px" height="25px" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M481 699l-135 71q-10 6-22 5t-21.5-8-14-18-2.5-22l26-150q2-10-1-20t-11-17L191 434q-8-8-11-19.5t.5-22.5 12.5-18.5 21-9.5l151-22q10-1 18-7t13-15l67-137q5-11 15-17t22-6 22 6 15 17l67 137q5 9 13 15t18 7l151 22q12 2 21 9.5t12.5 18.5.5 22.5-11 19.5L700 540q-8 7-11 17t-1 20l26 150q2 11-2.5 22t-14 18-21.5 8-22-5l-135-71q-9-5-19-5t-19 5z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="${encodeURIComponent(
          "#fff"
        )}"  height="20" width="20" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  const handleSwitchChange = () => {
    setSectiuneEchipaMea((prevSectiune) =>
      prevSectiune === "angajati" ? "echipe" : "angajati"
    );
  };

  const [seeMore, setSeeMore] = useState(false);

  const handleSeeMore = (value: boolean) => {
    setSeeMore(value);
  };

  return (
    <>
      <div id="echipaMea">
        {!seeMore && (
          <div style={{ margin: "2 rem" }}>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  checked={sectiuneEchipaMea === "echipe"}
                />
              }
              label={sectiuneEchipaMea === "angajati" ? "Angajati" : "Echipe"}
              onChange={handleSwitchChange}
            />
          </div>
        )}
        {sectiuneEchipaMea === "angajati" ? (
          <div id="listaAngajati">
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
            {loading ? (
              <DataGrid
                rows={empty}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                slots={{ toolbar: GridToolbar }}
              />
            ) : (
              <DataGrid
                rows={filteredRowsTable}
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
        ) : (
          <div id="listaEchipe">
            <TeamTable
              teamData={teamData}
              handleSeeMore={handleSeeMore}
              seeMore={seeMore}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EchipaMea;
