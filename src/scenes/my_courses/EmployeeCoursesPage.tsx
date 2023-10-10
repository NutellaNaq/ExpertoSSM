import React, { useEffect, useState } from "react";
import EmployeeCourses from "../../components/EmployeeCourses";
import { getAllAngajatiStatusApiRequest } from "../../requests/user.request";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { SelectChangeEvent } from "@mui/material";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading.json";

type fiseSSMStatus = {
  id: string;
  name: string;
  status: string;
};

type EmployeeCoursesProps = {
  id: string;
  nume: string;
  prenume: string;
  fiseSSMStatus: fiseSSMStatus[];
};

function EmployeeCoursesPage() {
  const [infoEmplooyes, setInfoEmplooyes] = useState(
    [] as EmployeeCoursesProps[]
  );
  const [filteredInfoEmplooyes, setFilteredInfoEmplooyes] = useState(
    [] as EmployeeCoursesProps[]
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default is 5 items per page
  const [searchInput, setSearchInput] = useState("");
  const [loaded, setLoaded] = useState(false);

  const getAngajatiStatus = async () => {
    const response = await getAllAngajatiStatusApiRequest();
    setInfoEmplooyes(response.data);
    console.log(response.data);
    setLoaded(true);
  };

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    setItemsPerPage(event.target.value as number);
    setPage(1); // Reset to the first page when changing items per page
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    getAngajatiStatus();
  }, []);

  useEffect(() => {
    const filteredEmployees = infoEmplooyes.filter(
      (employee) =>
        employee.nume.toLowerCase().includes(searchInput.toLowerCase()) ||
        employee.prenume.toLowerCase().includes(searchInput.toLowerCase())
    );

    setTotalPages(Math.ceil(filteredEmployees.length / itemsPerPage));
    setFilteredInfoEmplooyes(
      filteredEmployees.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    );
  }, [infoEmplooyes, page, itemsPerPage, searchInput]);

  useEffect(() => {
    setPage(1); // Reset to the first page when searching
  }, [searchInput]);

  return (
    <>
      {loaded ? (
        <section id="admin-courses-list">
          <Stack>
            <div className="search-bar">
              <TextField
                label="Cauta angajat"
                variant="outlined"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="courses-container">
              {filteredInfoEmplooyes.map((infoEmplooye) => {
                return (
                  <EmployeeCourses
                    infoEmplooye={infoEmplooye}
                    getAngajatiStatus={getAngajatiStatus}
                  />
                );
              })}
            </div>
            <div className="pagination-container">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChange}
                size="large"
              />
              <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <MenuItem value={5}>5 per page</MenuItem>
                <MenuItem value={10}>10 per page</MenuItem>
                <MenuItem value={20}>20 per page</MenuItem>
              </Select>
            </div>
          </Stack>
        </section>
      ) : (
        <Lottie
          animationData={Loading}
          style={{
            width: "100px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
    </>
  );
}

export default EmployeeCoursesPage;
