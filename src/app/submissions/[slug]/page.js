"use client";
import { useEffect, useState } from "react";
import SubmissionSidebar from "@/app/components/SubmissionSidebar";
import Editor from "@monaco-editor/react";
import Outputwindow from "@/app/components/outputwindow";
import { handlecompile } from "@/app/components/handlecompile";
import { getSubmissionByID } from "@/app/lib/SubmissionActions"; // Correct function name
import { languages } from "@/app/components/languages";

const SubmissionPage = ({ params }) => {
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [code, setCode] = useState("");
  const {slug}=params
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const sub = await getSubmissionByID({ subID: slug }); // Correct function call
        setSubmission(sub);
        setCode(sub?.code || "");
      } catch (error) {
        console.error("Error fetching submission:", error);
      }
    };

    fetchSubmission();
  }, [slug]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const language = languages.find((item) => item.id === submission?.languageId) || "plaintext";
  const handleOnClick = () => {
    if (submission?.languageId) {
      handlecompile(setProcessing, code, customInput, setOutputDetails,language);
    } else {
      console.error("Language ID is not available");
    }
  };
  return (
    <div className="w-full flex items-center justify-center mt-2 gap-1">
      <SubmissionSidebar subpage={true} bgColor={'#1e1e1e'} singlesub={submission}  />
      <div className="w-[50%] h-[90vh] rounded-xl">
        <Editor
          language={language.value}
          value={code}
          height="90vh"
          theme="vs-dark"
          width="100%"
          onChange={handleEditorChange}
          options={{
            inlineSuggest: true,
            fontSize: "17px",
            formatOnType: true,
            autoClosingBrackets: true,
            bracketPairColorization: true,
            wordWrap: "on",
            smoothScrolling: true,
          }}
        />
      </div>
      <div className="h-[90vh] w-[30%] flex flex-col gap-3 mr-1 ">
        <div className="text-white bg-[#1e1e1e] p-1 h-[45vh] rounded-xl overflow-auto">
          <h1>OUTPUT:</h1>
          <hr />
          <Outputwindow outputDetails={outputDetails} />
        </div>
        <div className="items-end flex flex-col">
          <textarea
            name="customInput"
            placeholder="Enter text for custom Input"
            className="p-1 border border-black border-b-4 border-r-4 rounded-xl w-full overflow-auto"
            rows={3}
            onChange={(e) => setCustomInput(e.target.value)}
            value={customInput}
          />
          <div className="flex items-center w-full justify-center ">
            <button
              disabled={!code}
              onClick={handleOnClick}
              className="border mt-1 border-t-0 border-l-0 border-black text-white bg-green-600 border-b-4 border-r-4 rounded-lg p-1"
            >
              {processing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start border border-black border-b-4 border-r-4 rounded-xl p-1 ">
          <h1 className="font-bold">
            Status: {outputDetails?.status?.description}
          </h1>
          <h1 className="font-bold">Memory: {outputDetails?.memory} </h1>
          <h1 className="font-bold">Time: {outputDetails?.time} </h1>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;
