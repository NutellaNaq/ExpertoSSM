import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import renderCellTrue from "./renderCellStatus";
import { getAllAngajatiStatusApiRequest } from "../../requests/user.request";
import { InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TeamTable, {
  createRows,
} from "../profil-angajati/adminPage/adminAngajati";
import TitlePage from "../../components/Title-Page";

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

type FisaSSM = {
  id: number;
  name: string;
  status: string;
};

type AngajatiStatus = {
  id: number;
  nume: string;
  prenume: string;
  fiseSSMStatus: FisaSSM[];
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

  const handleSetSectiuneEchipaMea = (value: string) => {
    setSectiuneEchipaMea(value);
  };

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

      setFilteredRowsTable(filterRows(rows));
    } else {
      setFilteredRowsTable(rows);
    }
  }, [searchTerm]);

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

    return columns;
  };

  const getFiseArray = async () => {
    try {
      const angajatiDataStatus = await getAllAngajatiStatusApiRequest();

      const angajatiDataStatusValue: AngajatiStatus[] = angajatiDataStatus.data;

      const rowTableStatusData = angajatiDataStatusValue.map(
        (element: AngajatiStatus) => {
          const medicinaMuncii = element?.fiseSSMStatus[0]?.status;
          const IIGM = element?.fiseSSMStatus[1]?.status;
          const ILM = element?.fiseSSMStatus[2]?.status;
          const IP = element?.fiseSSMStatus[3]?.status;
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
      setLoading(false);
    }
  };

  const [teamData, setTeamData] = useState([] as any[]);

  useEffect(() => {
    setColumns([]);
    setTheColumns();
    getFiseArray();
    const fetchData = async () => {
      const rowsToShow = await createRows();
      setTeamData(rowsToShow);
    };
    fetchData();
  }, []);

  const empty: AngajatTable[] = [];

  const [seeMore, setSeeMore] = useState(false);

  const handleSeeMore = (value: boolean) => {
    setSeeMore(value);
  };

  return (
    <>
      <div id="echipaMea">
        <TitlePage mainTitle={"ECHIPA MEA"} />
        {sectiuneEchipaMea === "angajati" ? (
          <div id="listaAngajati">
            <div style={{ margin: "2rem" }}>
              <Paper component="form" className="transparent">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <SearchIcon />
                  <InputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    value={searchTerm}
                    onChange={(e) => {
                      handleSearchInputChange(e.target.value);
                    }}
                  />

                  <button
                    className={`${
                      sectiuneEchipaMea ? "button-style-2" : "button-style-1"
                    }`}
                    style={{ margin: "0 1rem" }}
                    type="button"
                    onClick={() => setSectiuneEchipaMea("angajati")}
                  >
                    Angajati
                  </button>
                  <button
                    className={"button-style-1"}
                    style={{ margin: "0 1rem" }}
                    type="button"
                    onClick={() => setSectiuneEchipaMea("Echipe")}
                  >
                    Echipe
                  </button>
                </div>
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
                columns={setTheColumns()}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
              />
            )}
          </div>
        ) : (
          <div id="listaEchipe">
            <TeamTable
              teamData={teamData}
              handleSeeMore={handleSeeMore}
              seeMore={seeMore}
              handleSetSectiuneEchipaMea={handleSetSectiuneEchipaMea}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EchipaMea;
