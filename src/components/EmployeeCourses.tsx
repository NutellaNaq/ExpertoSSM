import { useEffect, useState } from "react";
import {
  adminCourseCompletedApiRequest,
  getPDFFileAPIRequest,
} from "../requests/user.request";

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

function EmployeeCourses({
  infoEmplooye,
  getAngajatiStatus,
}: {
  infoEmplooye: EmployeeCoursesProps;
  getAngajatiStatus?: () => void;
}) {
  const [dropdown, setDropdown] = useState(false);
  const [infoEmplooyesStatus, setInfoEmplooyesStatus] = useState(true);

  const checkStatus = () => {
    infoEmplooye.fiseSSMStatus.map((status) => {
      if (status.status === "needs completion") {
        setInfoEmplooyesStatus(false);
      }
    });
  };

  useEffect(() => {
    checkStatus();
  }, [infoEmplooye]);

  const handleDropdown = () => {
    setDropdown(!dropdown);
    console.log(dropdown);
  };

  const handleGenerateDocument = async () => {
    const PDFData = {
      course_id: infoEmplooye.fiseSSMStatus[0].id,
      employee_id: infoEmplooye.id,
    };

    const response = await getPDFFileAPIRequest(PDFData);

    // Create a blob from the response data
    const file = new Blob([response.data], { type: "application/pdf" });

    // Create a URL for the blob
    const fileURL = URL.createObjectURL(file);

    // Create a link element
    const link = document.createElement("a");

    // Set the link's href attribute to the file URL
    link.href = fileURL;

    // Set the link's download attribute to the file name
    link.download = "file.pdf";

    // Append the link to the document body
    document.body.appendChild(link);

    // Click the link to trigger the download
    link.click();

    // Remove the link from the document body
    document.body.removeChild(link);
  };

  const handleAdminCourseComplete =
    (id: string, statusId: string) =>
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      await adminCourseCompletedApiRequest(id, statusId);
      if (getAngajatiStatus) {
        getAngajatiStatus();
      }
    };

  return (
    <>
      <div>
        <div className="employee-course" onClick={handleDropdown}>
          <h3 style={{ color: "#ffffff" }}>
            <span style={{ color: "#98a4b3" }}>Angajatul: </span>
            {infoEmplooye.nume} {infoEmplooye.prenume}
          </h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            {infoEmplooyesStatus ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="35"
                viewBox="0 0 38 35"
                fill="none"
              >
                <path
                  d="M19.0679 0.928314C8.632 0.928314 0.162262 8.55108 0.162262 17.9434C0.162262 27.3357 8.632 34.9585 19.0679 34.9585C29.5038 34.9585 37.9736 27.3357 37.9736 17.9434C37.9736 8.55108 29.5038 0.928314 19.0679 0.928314ZM15.2868 26.451L5.83396 17.9434L8.49966 15.5443L15.2868 21.6357L29.6362 8.72123L32.3019 11.1374L15.2868 26.451Z"
                  fill="#3DD23A"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="35"
                viewBox="0 0 38 35"
                fill="none"
              >
                <path
                  d="M18.905 0C8.45053 0 0 7.6057 0 17.015C0 26.4243 8.45053 34.03 18.905 34.03C29.3595 34.03 37.81 26.4243 37.81 17.015C37.81 7.6057 29.3595 0 18.905 0ZM28.3575 23.1234L25.6919 25.5225L18.905 19.4141L12.1181 25.5225L9.4525 23.1234L16.2394 17.015L9.4525 10.9066L12.1181 8.5075L18.905 14.6159L25.6919 8.5075L28.3575 10.9066L21.5706 17.015L28.3575 23.1234Z"
                  fill="#BF1D1D"
                />
              </svg>
            )}
            <svg
              style={{ margin: " 0 0.6rem" }}
              className={dropdown ? "dropdown_rotate" : "dropdown_revert"}
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="13"
              viewBox="0 0 17 13"
              fill="none"
            >
              <path
                d="M2.44973 12.1305L8.71696 4.95702L14.9842 12.1305L16.9094 9.92206L8.71696 0.524506L0.524506 9.92206L2.44973 12.1305Z"
                fill="#CECACA"
              />
            </svg>
          </div>
        </div>

        <div className={`employee-course-dropdown ${dropdown && "active"}`}>
          <div
            className="course-status"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* go to each fiseSSMStatus and display the name and status */}
            {infoEmplooye.fiseSSMStatus.map((status) => (
              <div className="inner-course-status">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ marginRight: "1rem" }}>{status.name}</h3>
                  {status.status === "needs completion" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="27"
                      viewBox="0 0 28 27"
                      fill="none"
                    >
                      <path
                        d="M14 0C6.258 0 0 6.0345 0 13.5C0 20.9655 6.258 27 14 27C21.742 27 28 20.9655 28 13.5C28 6.0345 21.742 0 14 0ZM21 18.3465L19.026 20.25L14 15.4035L8.974 20.25L7 18.3465L12.026 13.5L7 8.6535L8.974 6.75L14 11.5965L19.026 6.75L21 8.6535L15.974 13.5L21 18.3465Z"
                        fill="#BF1D1D"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31"
                      height="29"
                      viewBox="0 0 31 29"
                      fill="none"
                    >
                      <path
                        d="M15.5 0C6.944 0 0 6.496 0 14.5C0 22.504 6.944 29 15.5 29C24.056 29 31 22.504 31 14.5C31 6.496 24.056 0 15.5 0ZM12.4 21.75L4.65 14.5L6.8355 12.4555L12.4 17.6465L24.1645 6.641L26.35 8.7L12.4 21.75Z"
                        fill="#3DD23A"
                      />
                    </svg>
                  )}
                </div>
                {status.status === "needs completion" ? (
                  <button
                    className="button-complete-admin"
                    onClick={handleAdminCourseComplete(
                      infoEmplooye.id,
                      status.id
                    )}
                  >
                    Completeaza Admin
                  </button>
                ) : (
                  <button
                    className="button-generate-document
                    "
                    onClick={handleGenerateDocument}
                  >
                    Genereaza document
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeCourses;
