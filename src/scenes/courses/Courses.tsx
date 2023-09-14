import React, { useEffect, useState } from "react";
import ScormApiWrapper from "@szenadam/scorm-api-wrapper";
import { useParams } from "react-router-dom";
import { checkIfCodeCourseIsValidApiRequest } from "../../requests/user.request";

const ScormIntegrationComponent: React.FC = () => {
  const [validCode, setValidCode] = useState(false);
  const [completionStatus, setCompletionStatus] = useState("");
  const [urlScorm, setUrlScorm] = useState("");
  const [score, setScore] = useState(0);

  // Take the code from the URL
  const { code } = useParams();

  const handleCheckForUrl = async (code: string) => {
    const checkForUrl = await checkIfCodeCourseIsValidApiRequest(code);

    if (checkForUrl.error) {
      return;
    }

    setValidCode(true);

    setUrlScorm(checkForUrl.url);
  };

  useEffect(() => {
    if (!code) {
      return;
    }

    // Check if the code is valid
    handleCheckForUrl(code);

    if (urlScorm === "") {
      return;
    }

    // Initialize the SCORM API wrapper here after ensuring that code and URL are valid
    const scorm = new ScormApiWrapper(true);
    scorm.scormVersion = "2004";
    scorm.handleCompletionStatus = true;

    if (scorm.initialize()) {
      console.log("SCORM API initialized successfully.");
    } else {
      console.error("Failed to initialize SCORM API.");
    }
  }, [code, urlScorm]);

  return (
    <>
      <div>
        {validCode ? (
          <>
            Completion Status: {completionStatus}, Score: {score}
          </>
        ) : (
          "Invalid Code"
        )}
      </div>
      <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        <iframe
          src="https://georgetestero.talentlms.com/securitatea-și-sanatatea-in-munca-instructaj-introductiv-general-scorm[...].zip/scormcontent/index.html"
          title="SCORM Content"
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
        ></iframe>
        <div
          style={{ width: "100%", height: "100vh", overflow: "hidden" }}
        ></div>
      </div>
    </>
  );
};

export default ScormIntegrationComponent;
