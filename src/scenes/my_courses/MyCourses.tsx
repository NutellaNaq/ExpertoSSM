import { useEffect, useState } from "react";
import { getSelfEmployeeStatusAPIRequest } from "../../requests/user.request";
import EmployeeCourses from "../../components/EmployeeCourses";

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

const INITIAL_VALUE = {
  id: "",
  nume: "",
  prenume: "",
  fiseSSMStatus: [],
};

function MyCourses() {
  const [selfEmployeeStatus, setSelfEmployeeStatus] = useState(
    INITIAL_VALUE as EmployeeCoursesProps
  );

  const handleGenerateDocument = async () => {
    const response = await getSelfEmployeeStatusAPIRequest();

    // get the data from the response

    setSelfEmployeeStatus(response.data);
  };

  useEffect(() => {
    handleGenerateDocument();
  }, []);

  return (
    <div id="my-courses">
      <EmployeeCourses infoEmplooye={selfEmployeeStatus} />
    </div>
  );
}

export default MyCourses;
