import {
  GridColDef,
  DataGrid,
  GridToolbar,
  GridRowSelectionModel,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
import renderCellStatusCar from "./renderCellStatusCar";

type Angajat = {
  last_name: string;
  first_name: string;
  badge_number: string;
  blood_type: string;
  home_adress: string;
  date_of_birth: string;
  place_of_birth: string;
  qualification: string;
  function: string;
  email: string;
  telephone: string;
  department: string;
  internal_matriculation_number: string;
  date_of_employment: string;
  drives_the_company_car: boolean;
};

type AngajatTable = Angajat & {
  id: number;
};

const INITIAL_VALUE = {
  last_name: "",
  first_name: "",
  badge_number: "",
  blood_type: "",
  home_adress: "",
  date_of_birth: "",
  place_of_birth: "",
  qualification: "",
  function: "",
  email: "",
  telephone: "",
  department: "",
  internal_matriculation_number: "",
  date_of_employment: "",
  drives_the_company_car: false,
};

type props = {
  userPermissions: string[];
};

type UserAngajat = {
  email?: string;
  last_name?: string;
  first_name?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  blood_type?: string;
  telephone?: string;
  role: string;
};

function ProfilAngajati({ userPermissions }: props) {
  const [adaugaAngajat, setAdaugaAngajat] = useState(false);
  const [editAngajat, setEditAngajat] = useState(false);
  const [editRight, setEditRight] = useState(false);
  const [angajatData, setAngajatData] = useState(INITIAL_VALUE);
  const [userAngajatInfo, setUserAngajatInfo] = useState({
    email: "",
    telephone: "",
    last_name: "",
    first_name: "",
    date_of_birth: "",
    place_of_birth: "",
    blood_type: "",
    home_address: "",
    role: "",
  });
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [rowToDelete, setRowToDelete] = useState<GridRowModel[]>([]);
  const [modalDeleteSingleRow, setModalDeleteSingleRow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRowsTable, setFilteredRowsTable] = useState<AngajatTable[]>(
    []
  );

  const [passwordWarning, setPasswordWarning] = useState(false);
  const [passwordWarningMessage, setPasswordWarningMessage] = useState("");

  const [emailWarning, setEmailWarning] = useState(false);
  const [emailWarningMessage, setEmailWarningMessage] = useState("");

  const [openModalAdaugaAngajat, setOpenModalAdaugaAngajat] = useState(false);

  const handleClickOpen = () => {
    setOpenModalAdaugaAngajat(true);
  };

  const handleClickOpenNewAngajat = () => {
    setAdaugaAngajat(true);
    handleClickOpen();
    setAngajatData(INITIAL_VALUE);
  };

  const handleClose = () => {
    setOpenModalAdaugaAngajat(false);
  };

  const checkTelefon = (telephone: string) => {
    //check if the phone number is a valid romanian phone number
    const regex = /^(07)[0-9]{8}$/;
    return regex.test(telephone);
  };

  const checkEmail = (email: string) => {
    //check if the email is a valid email
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (passwordWarning) {
      if (checkTelefon(angajatData.telephone)) {
        setPasswordWarning(false);
        setPasswordWarningMessage("");
      } else {
        setPasswordWarning(true);
        setPasswordWarningMessage("Numarul de telefon nu este valid");
      }
    }
  }, [angajatData.telephone]);

  useEffect(() => {
    if (passwordWarning) {
      if (checkEmail(userAngajatInfo.email)) {
        setEmailWarning(false);
        setEmailWarningMessage("");
      } else {
        setEmailWarning(true);
        setEmailWarningMessage("Email-ul nu este valid");
      }
    }
  }, [userAngajatInfo.email]);

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
                handleClickOpen();
                handleEdit(params);
              }}
            />
          </IconButton>
        </div>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "last_name", headerName: "Nume", width: 160 },
    { field: "first_name", headerName: "Prenume", width: 160 },
    { field: "badge_number", headerName: "Legitimatie", width: 160 },
    { field: "blood_type", headerName: "Grupa sanguina", width: 160 },
    { field: "qualification", headerName: "Calificarea", width: 160 },
    { field: "function", headerName: "Functia", width: 160 },
    { field: "department", headerName: "Departamentul", width: 160 },
    {
      field: "drives_the_company_car",
      headerName: "Conduce masina companiei",
      width: 160,
    },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "last_name", headerName: "Nume", width: 160 },
    { field: "first_name", headerName: "Prenume", width: 160 },
    { field: "badge_number", headerName: "Legitimatie", width: 160 },
    { field: "blood_type", headerName: "Grupa sanguina", width: 160 },
    { field: "qualification", headerName: "Calificarea", width: 160 },
    { field: "function", headerName: "Functia", width: 160 },
    { field: "department", headerName: "Departamentul", width: 160 },
    {
      field: "drives_the_company_car",
      headerName: "Conduce masina companiei",
      width: 160,
      renderCell: renderCellStatusCar,
    },
  ];

  const fetchAngajati = async () => {
    const getAngajatiInfo = await getAllAngajatiAPIRequest();

    if (getAngajatiInfo.error) {
      return [];
    }

    const angajatiArray: AngajatTable[] = Object.values(
      getAngajatiInfo.employees
    );

    console.log("angajatiArray");
    console.log(angajatiArray);

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
          return row.last_name.toLowerCase().includes(searchTerm.toLowerCase());
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
      if (angajatData.email == "" && angajatData.telephone !== "") {
        const telefonValue = angajatData.telephone;
        handleUserAngajatChange({ telephone: telefonValue });
      } else if (angajatData.telephone == "" && angajatData.email !== "") {
        const emailValue = angajatData.email;
        handleUserAngajatChange({ email: emailValue });
      } else {
        const emailValue = angajatData.email;
        const telefonValue = angajatData.telephone;
        setUserAngajatInfo({
          ...userAngajatInfo,
          email: emailValue,
          telephone: telefonValue,
        });
      }

      const createAngajatUser = await registerUserAngajatAPIRequest(
        userAngajatInfo
      );

      console.log(createAngajatUser);

      // Check if the response contains user_id
      if (!createAngajatUser) {
        alert("Failed to create user.");
        return;
      }

      const createAngajatDataWithUserId = async () => {
        const angajatDataWithUserId = {
          ...angajatData,
          user_id: createAngajatUser.id, // Use the user_id from the response
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
        last_name: responseAngajat.last_name,
        first_name: responseAngajat.first_name,
        badge_number: responseAngajat.badge_number,
        blood_type: responseAngajat.blood_type,
        home_adress: responseAngajat.home_adress,
        date_of_birth: responseAngajat.date_of_birth,
        place_of_birth: responseAngajat.place_of_birth,
        qualification: responseAngajat.qualification,
        function: responseAngajat.function,
        email: responseAngajat.email,
        telephone: responseAngajat.telephone,
        department: responseAngajat.department,
        internal_matriculation_number:
          responseAngajat.internal_matriculation_number,
        date_of_employment: responseAngajat.date_of_employment,
        drives_the_company_car: responseAngajat.drives_the_company_car,
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
            last_name: responseEditAngajat.last_name,
            first_name: responseEditAngajat.first_name,
            badge_number: responseEditAngajat.badge_number,
            blood_type: responseEditAngajat.blood_type,
            home_adress: responseEditAngajat.home_adress,
            date_of_birth: responseEditAngajat.date_of_birth,
            place_of_birth: responseEditAngajat.place_of_birth,
            qualification: responseEditAngajat.qualification,
            function: responseEditAngajat.function,
            email: responseEditAngajat.email,
            telephone: responseEditAngajat.telephone,
            department: responseEditAngajat.department,
            internal_matriculation_number:
              responseEditAngajat.internal_matriculation_number,
            date_of_employment: responseEditAngajat.date_of_employment,
            drives_the_company_car: responseEditAngajat.drives_the_company_car,
          };
        }
        return item;
      });

      setRow(newRows);

      setOpenModalAdaugaAngajat(false);
      handleClose();
    }
  };

  return (
    <div id="profilAngajati">
      {openModalAdaugaAngajat && (
        <Dialog open={openModalAdaugaAngajat} onClose={handleClose}>
          <DialogTitle>Adauga Angajati</DialogTitle>
          <DialogContent>
            <form
              onSubmit={handleOnSubmit}
              className="flex column align-items-center w-auto"
            >
              <div id="adauga-angajat-container" className="flex">
                <div className="flex column">
                  <div className="flex column">
                    <input
                      required
                      type="text"
                      placeholder="Nume"
                      value={angajatData.last_name}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          last_name: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Prenume"
                      value={angajatData.first_name}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          first_name: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Legitimatie"
                      value={angajatData.badge_number}
                      onChange={(e) => {
                        handleInputChange({
                          badge_number: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Grupa sanguina"
                      value={angajatData.blood_type}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          blood_type: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Domiciliul"
                      value={angajatData.home_adress}
                      onChange={(e) => {
                        handleInputChange({
                          home_adress: e.target.value,
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
                      value={angajatData.date_of_birth}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          date_of_birth: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Locul nasterii"
                      value={angajatData.place_of_birth}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          place_of_birth: e.target.value,
                        });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Calificarea"
                      value={angajatData.qualification}
                      onChange={(e) => {
                        handleInputChange({
                          qualification: e.target.value,
                        });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Functia"
                      value={angajatData.function}
                      onChange={(e) => {
                        handleInputChange({
                          function: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="mail"
                      placeholder="Email"
                      style={{ borderColor: emailWarning ? "red" : "" }}
                      value={angajatData.email}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          email: e.target.value,
                        });
                      }}
                    />
                    <label>{emailWarningMessage}</label>
                    <input
                      required
                      style={{ borderColor: passwordWarning ? "red" : "" }}
                      type="tel"
                      placeholder="telefon"
                      value={angajatData.telephone}
                      onChange={(e) => {
                        handleDoubleInputChange({
                          telephone: e.target.value,
                        });
                      }}
                    />
                    <label>{passwordWarningMessage}</label>
                  </div>
                </div>
                <div className="flex column">
                  <div className="flex column">
                    <input
                      required
                      type="text"
                      placeholder="Departamentul"
                      value={angajatData.department}
                      onChange={(e) => {
                        handleInputChange({
                          department: e.target.value,
                        });
                      }}
                    />
                    <input
                      required
                      type="number"
                      placeholder="Numar matricol intern"
                      value={angajatData.internal_matriculation_number}
                      onChange={(e) => {
                        handleInputChange({
                          internal_matriculation_number: e.target.value,
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
                      value={angajatData.date_of_employment}
                      onChange={(e) => {
                        handleInputChange({
                          date_of_employment: e.target.value,
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
                          checked={angajatData.drives_the_company_car}
                          onChange={(e) => {
                            handleInputChange({
                              drives_the_company_car: e.target.value == "true",
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
                          checked={!angajatData.drives_the_company_car}
                          onChange={(e) => {
                            handleInputChange({
                              drives_the_company_car: e.target.value == "true",
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
                    onClick={handleClose}
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
          </DialogContent>
        </Dialog>
      )}
      <div>
        <div
          className="flex row-reverse space-between"
          style={{ margin: "2rem" }}
        >
          {editRight && (
            <button
              className="blue-button"
              style={{ margin: "1rem" }}
              onClick={handleClickOpenNewAngajat}
            >
              Adauga Angajat
            </button>
          )}

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
