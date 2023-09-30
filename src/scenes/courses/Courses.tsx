import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkIfCodeCourseIsValidApiRequest } from "../../requests/user.request";
import { scormInit } from "./scorm_lms.js";

const ScormComponent: React.FC = () => {
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

    setCompletionStatus("incomplete");

    setScore(0);
  }, [code, urlScorm]);

  const handleIframeLoad = () => {
    // Call scormInit when the iframe has loaded
    scormInit({
      window,
      prefixNumber: 2,
      callback: ({ progress }) => {
        console.log("progress", progress);
      },
    });
  };

  return (
    <>
      <h1>
        {validCode} , {score} , {completionStatus}
      </h1>
      <iframe
        src="https://georgenacu.dev.ascensys.ro/ExpertoSSM/dashboard/zip/scormdriver/indexAPI.html"
        name="course"
        frameBorder="0"
        style={{
          overflow: "hidden",
          overflowX: "hidden",
          overflowY: "hidden",
          height: "100vh",
          width: "100%",
        }}
        onLoad={handleIframeLoad}
      ></iframe>
    </>
  );
};

export default ScormComponent;
