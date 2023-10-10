import { useEffect, useState } from "react";
import {
  courseLinksApiRequest,
  getPDFFileAPIRequest,
  getSelfEmployeeStatusAPIRequest,
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

function MyCourses() {
  const [personalInfo, setPersonalInfo] = useState<EmployeeCoursesProps>();
  const [linksToCourses, setLinksToCourses] = useState<string[]>([]);

  const getPerosnalInfo = async () => {
    const response = await getSelfEmployeeStatusAPIRequest();

    const dataInTheArray: fiseSSMStatus[] = response.data.fiseSSMStatus;

    //after getting the data, we put the fiseSSMStatus into an array

    const fiseSSMStatusArray = dataInTheArray.map((status) => {
      return status.id;
    });

    const getLinks = await courseLinksApiRequest(fiseSSMStatusArray);

    setPersonalInfo(response.data);
    setLinksToCourses(getLinks.course_links);
  };

  const handleGenerateDocument = async (
    courseID: string,
    employeeID: string
  ) => {
    const PDFData = {
      employee_id: employeeID,
      course_id: courseID,
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

  useEffect(() => {
    getPerosnalInfo();
  }, []);

  return (
    <section id="my-courses-list">
      <div className="centering-container">
        <div className="my-courses-container">
          {personalInfo?.fiseSSMStatus.map((status) => (
            <div className="grid-info-my-courses ">
              <h5>{status.name}</h5>
              <h4>{status.status}</h4>
              {status.status === "needs completion" &&
              linksToCourses[parseInt(status.id)] !== null ? (
                <a
                  href={
                    "https://georgenacu.dev.ascensys.ro/ExpertoSSM/cursuri/index.html" +
                    linksToCourses[parseInt(status.id)]
                  }
                >
                  <button className="button-start-course">Incepe Cursul</button>
                </a>
              ) : null}
              {status.status === "completed" ? (
                <button
                  className="button-generate-document"
                  onClick={() => {
                    handleGenerateDocument(status.id, personalInfo.id);
                  }}
                >
                  Descarca Documente
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyCourses;
