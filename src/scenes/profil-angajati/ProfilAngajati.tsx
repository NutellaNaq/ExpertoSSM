import {
  GridColDef,
  DataGrid,
  GridToolbar,
  GridRowSelectionModel,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import {
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  createAngajatAPIRequest,
  deleteAngajatAPIRequest,
  getAllAngajatiAPIRequest,
  registerUserAngajatAPIRequest,
  updateAngajatAPIRequest,
} from "../../requests/user.request";
import { useEffect, useState } from "react";
import ModalDelete from "./modals/ModalDelete";

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

type AngajatTable = Angajat & {
  id: number;
};

const INITIAL_VALUE = {
  nume: "",
  prenume: "",
  legitimatie: "",
  grupaSanguina: "",
  domiciliu: "",
  dataNasterii: "",
  loculNasterii: "",
  calificarea: "",
  functia: "",
  email: "",
  telefon: "",
  departamentul: "",
  numarMatricolIntern: "",
  dataAngajarii: "",
  conduceMasinaCompaniei: false,
};

type props = {
  userPermissions: string[];
};

type UserAngajat = {
  email?: string;
  telefon?: string;
  role: string;
};

function ProfilAngajati({ userPermissions }: props) {
  const [adaugaAngajat, setAdaugaAngajat] = useState(false);
  const [editAngajat, setEditAngajat] = useState(false);
  const [editRight, setEditRight] = useState(false);
  const [angajatData, setAngajatData] = useState(INITIAL_VALUE);
  const [userAngajatInfo, setUserAngajatInfo] = useState({
    email: "",
    telefon: "",
    role: "",
  });
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [rowToDelete, setRowToDelete] = useState<GridRowModel[]>([]);
  const [modalDeleteSingleRow, setModalDeleteSingleRow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRowsTable, setFilteredRowsTable] = useState<AngajatTable[]>(
    []
  );

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleInputChange = (value: Partial<Angajat>) => {
    setAngajatData({ ...angajatData, ...value });
  };

  const handleDoubleInputChange = (value: Partial<Angajat>) => {
    setAngajatData({ ...angajatData, ...value });
    setUserAngajatInfo({ ...userAngajatInfo, ...value });
  };

  const handleUserAngajatChange = (value: Partial<UserAngajat>) => {
    setUserAngajatInfo({ ...userAngajatInfo, ...value });
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = event.target.value;
    handleUserAngajatChange({ role: selectedRole });
  };

  function handleSetModalDeleteSingleRow(value: boolean) {
    setModalDeleteSingleRow(value);
  }

  const handleSetAdaugaAngajat = (value: boolean) => () => {
    setAdaugaAngajat(value);
  };

  const handleSetEditAngajat = (value: boolean) => () => {
    setEditAngajat(value);
  };

  const [row, setRow] = useState<AngajatTable[]>([]);

  const deleteAngajat = async (rowData: GridRowModel) => {
    const modelString = rowData.id.toString();

    const deleteAngajatInfo = await deleteAngajatAPIRequest(modelString);

    if (deleteAngajatInfo.error) {
      alert(deleteAngajatInfo.message);
      return;
    }

    //remove the deleted element from the state
    setRow(row.filter((item) => item.id !== rowData.id));
  };

  const handleDeleteSingleRow = async (rowData: GridRowModel) => {
    await deleteAngajat(rowData);
  };

  const handleCellClick = (params: GridRowModel) => {
    const isDeleteButtonClicked =
      params.field === "actions" && params.colDef.field === "delete";
    if (isDeleteButtonClicked) {
      params.api.clearRowSelection(params.rowModel.id);
    }
  };

  const handleDeleteRow = () => {
    // Perform deletion logic here, such as making an API request

    // make a async function for deleteAngajatAPIRequest request

    const deleteAngajat = async (model: GridRowId) => {
      //create a variable that converts the model to a string
      const modelString = model.toString();

      const deleteAngajatInfo = await deleteAngajatAPIRequest(modelString);

      if (deleteAngajatInfo.error) {
        alert(deleteAngajatInfo.message);
        return;
      }

      // set the state of row to the new array without the deleted element
      setRow(row.filter((item) => item.id !== model));
    };

    selectionModel.forEach((model) => {
      deleteAngajat(model);
    });
  };

  const handleEdit = (model: GridRowModel) => {
    setEditAngajat(true);

    setAngajatData(model.row as Angajat);
  };

  const columnsEdit: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <div>
          <IconButton color="secondary">
            <DeleteIcon
              onClick={(event) => {
                event.stopPropagation();
                setModalDeleteSingleRow(true);
                setRowToDelete(params.row);
              }}
            />
          </IconButton>

          <IconButton color="primary">
            <EditIcon
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params);
              }}
            />
          </IconButton>
        </div>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "nume", headerName: "Nume", width: 160 },
    { field: "prenume", headerName: "Prenume", width: 160 },
    { field: "legitimatie", headerName: "Legitimatie", width: 160 },
    { field: "grupaSanguina", headerName: "Grupa sanguina", width: 160 },
    { field: "calificarea", headerName: "Calificarea", width: 160 },
    { field: "functia", headerName: "Functia", width: 160 },
    { field: "departamentul", headerName: "Departamentul", width: 160 },
    {
      field: "conduceMasinaCompaniei",
      headerName: "Conduce masina companiei",
      width: 160,
    },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nume", headerName: "Nume", width: 160 },
    { field: "prenume", headerName: "Prenume", width: 160 },
    { field: "legitimatie", headerName: "Legitimatie", width: 160 },
    { field: "grupaSanguina", headerName: "Grupa sanguina", width: 160 },
    { field: "calificarea", headerName: "Calificarea", width: 160 },
    { field: "functia", headerName: "Functia", width: 160 },
    { field: "departamentul", headerName: "Departamentul", width: 160 },
    {
      field: "conduceMasinaCompaniei",
      headerName: "Conduce masina companiei",
      width: 160,
    },
  ];

  const fetchAngajati = async () => {
    const getAngajatiInfo = await getAllAngajatiAPIRequest();

    if (getAngajatiInfo.error) {
      return [];
    }

    const angajatiArray: AngajatTable[] = Object.values(
      getAngajatiInfo.angajati
    );

    const newRows = angajatiArray.map((item: AngajatTable) => {
      const {
        id,
        nume,
        prenume,
        legitimatie,
        grupaSanguina,
        domiciliu,
        dataNasterii,
        loculNasterii,
        calificarea,
        functia,
        email,
        telefon,
        departamentul,
        numarMatricolIntern,
        dataAngajarii,
        conduceMasinaCompaniei,
      } = item;
      return {
        id,
        nume,
        prenume,
        legitimatie,
        grupaSanguina,
        domiciliu,
        dataNasterii,
        loculNasterii,
        calificarea,
        functia,
        email,
        telefon,
        departamentul,
        numarMatricolIntern,
        dataAngajarii,
        conduceMasinaCompaniei,
      };
    });

    setRow(angajatiArray);
    setFilteredRowsTable(angajatiArray);
  };

  useEffect(() => {
    setAngajatData(INITIAL_VALUE);
  }, [adaugaAngajat]);

  useEffect(() => {
    if (userPermissions.includes("edit-profil-angajati")) {
      setEditRight(true);
    }

    fetchAngajati();
  }, []);

  function handleFilterRows() {
    if (searchTerm !== "") {
      const filterRows = (rows: AngajatTable[]) => {
        return rows.filter((row) => {
          return row.nume.toLowerCase().includes(searchTerm.toLowerCase());
        });
      };

      setFilteredRowsTable(filterRows(row));
    } else {
      setFilteredRowsTable(row);
    }
  }

  useEffect(() => {
    handleFilterRows();
  }, [searchTerm, row]);

  const handleSelectionModelChange = (newSelection: GridRowSelectionModel) => {
    setSelectionModel(newSelection);
  };

  const CustomToolbar = () => {
    const selectedRowCount = selectionModel.length;

    return (
      <Toolbar>
        <GridToolbar />
        {selectedRowCount > 0 && (
          <>
            <IconButton
              onClick={handleDeleteRow}
              color="primary"
              aria-label="delete"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
            <Typography>{selectedRowCount} selected</Typography>
          </>
        )}
      </Toolbar>
    );
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (adaugaAngajat) {
      if (angajatData.email == "" && angajatData.telefon !== "") {
        const telefonValue = angajatData.telefon;
        handleUserAngajatChange({ telefon: telefonValue });
      } else if (angajatData.telefon == "" && angajatData.email !== "") {
        const emailValue = angajatData.email;
        handleUserAngajatChange({ email: emailValue });
      } else {
        const emailValue = angajatData.email;
        const telefonValue = angajatData.telefon;
        setUserAngajatInfo({
          ...userAngajatInfo,
          email: emailValue,
          telefon: telefonValue,
        });
      }

      const createAngajatUser = await registerUserAngajatAPIRequest(
        userAngajatInfo
      );

      // Check if the response contains user_id
      if (!createAngajatUser) {
        alert("Failed to create user.");
        return;
      }

      const createAngajatDataWithUserId = async () => {
        const angajatDataWithUserId = {
          ...angajatData,
          user_id: createAngajatUser.user.id, // Use the user_id from the response
        };
        const responseAngajat = await createAngajatAPIRequest(
          angajatDataWithUserId
        );

        return responseAngajat;
      };

      const responseAngajat = await createAngajatDataWithUserId();

      if (responseAngajat.error) {
        alert(responseAngajat.message);
        return;
      }
      const newRow = {
        id: responseAngajat.id,
        nume: responseAngajat.nume,
        prenume: responseAngajat.prenume,
        legitimatie: responseAngajat.legitimatie,
        grupaSanguina: responseAngajat.grupaSanguina,
        domiciliu: responseAngajat.domiciliu,
        dataNasterii: responseAngajat.dataNasterii,
        loculNasterii: responseAngajat.loculNasterii,
        calificarea: responseAngajat.calificarea,
        functia: responseAngajat.functia,
        email: responseAngajat.email,
        telefon: responseAngajat.telefon,
        departamentul: responseAngajat.departamentul,
        numarMatricolIntern: responseAngajat.numarMatricolIntern,
        dataAngajarii: responseAngajat.dataAngajarii,
        conduceMasinaCompaniei: responseAngajat.conduceMasinaCompaniei,
      };

      setRow([...row, newRow]);

      setAdaugaAngajat(false);
    } else {
      const responseEditAngajat = await updateAngajatAPIRequest(angajatData);
      if (responseEditAngajat.error) {
        alert(responseEditAngajat.message);
        return;
      }

      // update the state of row with the new edited row
      const newRows = row.map((item) => {
        if (item.id === responseEditAngajat.id) {
          return {
            id: responseEditAngajat.id,
            nume: responseEditAngajat.nume,
            prenume: responseEditAngajat.prenume,
            legitimatie: responseEditAngajat.legitimatie,
            grupaSanguina: responseEditAngajat.grupaSanguina,
            domiciliu: responseEditAngajat.domiciliu,
            dataNasterii: responseEditAngajat.dataNasterii,
            loculNasterii: responseEditAngajat.loculNasterii,
            calificarea: responseEditAngajat.calificarea,
            functia: responseEditAngajat.functia,
            email: responseEditAngajat.email,
            telefon: responseEditAngajat.telefon,
            departamentul: responseEditAngajat.departamentul,
            numarMatricolIntern: responseEditAngajat.numarMatricolIntern,
            dataAngajarii: responseEditAngajat.dataAngajarii,
            conduceMasinaCompaniei: responseEditAngajat.conduceMasinaCompaniei,
          };
        }
        return item;
      });

      setRow(newRows);

      setEditAngajat(false);
    }
  };

  return (
    <div id="profilAngajati">
      {adaugaAngajat || editAngajat ? (
        <form
          onSubmit={handleOnSubmit}
          className="flex column align-items-center w-auto"
        >
          <div id="adauga-angajat-container" className="flex">
            <div className="flex column">
              <div className="flex column">
                <h3 className="w-auto">Informatii angajat</h3>
                <input
                  required
                  type="text"
                  placeholder="Nume"
                  value={angajatData.nume}
                  onChange={(e) => {
                    handleInputChange({
                      nume: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="text"
                  placeholder="Prenume"
                  value={angajatData.prenume}
                  onChange={(e) => {
                    handleInputChange({
                      prenume: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="text"
                  placeholder="Legitimatie"
                  value={angajatData.legitimatie}
                  onChange={(e) => {
                    handleInputChange({
                      legitimatie: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="text"
                  placeholder="Grupa sanguina"
                  value={angajatData.grupaSanguina}
                  onChange={(e) => {
                    handleInputChange({
                      grupaSanguina: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="text"
                  placeholder="Domiciliul"
                  value={angajatData.domiciliu}
                  onChange={(e) => {
                    handleInputChange({
                      domiciliu: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex column">
                <label className="w-auto" htmlFor="date">
                  Data nasterii
                </label>
                <input
                  required
                  type="date"
                  placeholder="Data nasterii"
                  value={angajatData.dataNasterii}
                  onChange={(e) => {
                    handleInputChange({
                      dataNasterii: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="text"
                  placeholder="Locul nasterii"
                  value={angajatData.loculNasterii}
                  onChange={(e) => {
                    handleInputChange({
                      loculNasterii: e.target.value,
                    });
                  }}
                />
                <input
                  type="text"
                  placeholder="Calificarea"
                  value={angajatData.calificarea}
                  onChange={(e) => {
                    handleInputChange({
                      calificarea: e.target.value,
                    });
                  }}
                />
                <input
                  type="text"
                  placeholder="Functia"
                  value={angajatData.functia}
                  onChange={(e) => {
                    handleInputChange({
                      functia: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="mail"
                  placeholder="Email"
                  value={angajatData.email}
                  onChange={(e) => {
                    handleDoubleInputChange({
                      email: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="tel"
                  placeholder="Telefon"
                  value={angajatData.telefon}
                  onChange={(e) => {
                    handleDoubleInputChange({
                      telefon: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex column">
              <div className="flex column">
                <input
                  required
                  type="text"
                  placeholder="Departamentul"
                  value={angajatData.departamentul}
                  onChange={(e) => {
                    handleInputChange({
                      departamentul: e.target.value,
                    });
                  }}
                />
                <input
                  required
                  type="number"
                  placeholder="Numar matricol intern"
                  value={angajatData.numarMatricolIntern}
                  onChange={(e) => {
                    handleInputChange({
                      numarMatricolIntern: e.target.value,
                    });
                  }}
                />
                <label className="w-auto" htmlFor="date">
                  Data angajarii
                </label>
                <input
                  required
                  type="date"
                  placeholder="Data angajarii"
                  value={angajatData.dataAngajarii}
                  onChange={(e) => {
                    handleInputChange({
                      dataAngajarii: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex column">
                <h3 className="w-auto">Conduce masina companiei?</h3>
                <div className="flex">
                  <div
                    style={{ marginRight: "1rem" }}
                    className="flex align-items-center"
                  >
                    <input
                      style={{ width: "fit-content" }}
                      type="radio"
                      id="Da"
                      name="conduceMasinCompaniei"
                      value="1"
                      checked={angajatData.conduceMasinaCompaniei}
                      onChange={(e) => {
                        handleInputChange({
                          conduceMasinaCompaniei: e.target.value == "true",
                        });
                      }}
                    />
                    <label htmlFor="Da">Da</label>
                    <br />
                  </div>
                  <div className="flex align-items-center">
                    <input
                      required
                      style={{ width: "fit-content" }}
                      type="radio"
                      id="Nu"
                      name="conduceMasinCompaniei"
                      value="0"
                      checked={!angajatData.conduceMasinaCompaniei}
                      onChange={(e) => {
                        handleInputChange({
                          conduceMasinaCompaniei: e.target.value == "true",
                        });
                      }}
                    />
                    <label htmlFor="Nu">Nu</label>
                    <br />
                  </div>
                </div>

                <select
                  name="roles"
                  id="role"
                  onChange={handleRoleChange}
                  value={userAngajatInfo.role}
                >
                  <option value="administrator">Administrator</option>
                  <option value="angajator">Angajator</option>
                  <option value="angajat">Angajat</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex w-auto">
            {adaugaAngajat ? (
              <button
                type="button"
                className="button-style-2"
                onClick={handleSetAdaugaAngajat(false)}
              >
                Anuleaza
              </button>
            ) : (
              <button
                type="button"
                className="button-style-2"
                onClick={handleSetEditAngajat(false)}
              >
                Anuleaza
              </button>
            )}

            {adaugaAngajat ? (
              <button type="submit" className="button-style-1">
                Adauga angajat
              </button>
            ) : (
              <button type="submit" className="button-style-1">
                Editeaza angajat
              </button>
            )}
          </div>
        </form>
      ) : (
        <div>
          <div
            className="flex row-reverse space-between"
            style={{ margin: "2rem" }}
          >
            <button
              className="blue-button"
              style={{ margin: "1rem" }}
              onClick={handleSetAdaugaAngajat(true)}
            >
              Adauga Angajat
            </button>

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

          <div>
            {editRight ? (
              <DataGrid
                rows={filteredRowsTable}
                columns={columnsEdit}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                checkboxSelection
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={handleSelectionModelChange}
                slots={{
                  toolbar: CustomToolbar,
                }}
                onCellClick={handleCellClick}
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
                checkboxSelection
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={handleSelectionModelChange}
                slots={{
                  toolbar: CustomToolbar,
                }}
                onCellClick={handleCellClick}
              />
            )}
          </div>
        </div>
      )}
      {modalDeleteSingleRow ? (
        <ModalDelete
          handleDeleteSingleRow={handleDeleteSingleRow}
          rowToDelete={rowToDelete}
          handleSetModalDeleteSingleRow={handleSetModalDeleteSingleRow}
        />
      ) : null}
    </div>
  );
}

export default ProfilAngajati;
