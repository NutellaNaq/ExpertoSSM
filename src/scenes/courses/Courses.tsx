import React, { useEffect, useState } from "react";
import ScormApiWrapper from "@szenadam/scorm-api-wrapper";

const ScormIntegrationComponent: React.FC = () => {
  const [completionStatus, setCompletionStatus] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize the SCORM API wrapper
    const scorm = new ScormApiWrapper(true);

    // Check for SCORM initialization errors
    if (!scorm.initialize()) {
      console.error("SCORM initialization error:");
    }

    //get the info after the completion of the course
    setCompletionStatus(scorm.dataCompletionStatus);
    setScore(scorm.getCode());

    scorm.terminate();
  }, []);

  return (
    <>
      <div>
        {completionStatus}, {score}
      </div>
      <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        <iframe
          src="./../../scorm/scormcontent/index.html"
          title="SCORM Content"
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
        ></iframe>
        <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
          <iframe
            src="./../../scorm/scormcontent/index.html#/preview"
            title="External HTML Content"
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default ScormIntegrationComponent;
