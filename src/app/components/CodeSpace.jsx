"use client";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handlecompile } from "./handlecompile";
import OutputWindow from "./outputwindow";
import { useUser } from "@clerk/nextjs";
import Submission from "./Submission";
import {
  deleteSubmission,
  getSubmissions,
  saveSubmission,
  updateSubmission,
} from "../lib/SubmissionActions";
import { FaRegTrashAlt } from "react-icons/fa";

const CodeSpace = ({ language }) => {
  const { user, isSignedIn } = useUser();
  const id = Date.now().toString();
  const [code, setCode] = useState(
    `#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`
  );
  const [customInput, setcustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showbox, setShowBox] = useState(false);
  const [name, setName] = useState("");
  const [userSubs, setUserSubs] = useState({});
  const [save, setSave] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [update, setUpdate] = useState(false);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const fetchSubmissions = async () => {
    const submissions = await getSubmissions();
    setUserSubs(submissions);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [save, deleted, update]);

  const handleonclick = () => {
    handlecompile(setProcessing, code, customInput, setOutputDetails, language);
  };
  const lname = language.name;
  const languageId = language.id;

  const handlesubmissionsave = () => {
    const data = saveSubmission({ name, code, languageId });
    if (data) {
      toast.success("Saved");
      setSave(!save);
      fetchSubmissions(); // Update the submissions list
    }
    setShowBox(false);
  };

  const onchange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleEditorChange = (value) => {
    onchange("code", value);
  };

  const handleSubmissionClick = (id, code) => {
    setSelectedSubmissionId(id);
    setCode(code);
  };

  const handlereset = () => {
    setSelectedSubmissionId(null);
    setCode(
      `#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`
    );
  };

  const updateSub = async () => {
    console.log(selectedSubmissionId);
    const updated = await updateSubmission({
      id: selectedSubmissionId,
      code,
      languageId,
    });
    if (updated) {
      toast.success("Submission Updated ✅ ");
      setUpdate(!update);
      fetchSubmissions(); // Update the submissions list
    }
  };

  const handledelete = async () => {
    const deleted = await deleteSubmission({ id: selectedSubmissionId });
    if (deleted) {
      toast.success("Submission Deleted");
      setSelectedSubmissionId(null);
      setCode(
        `#include<iostream>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`
      );
      setDeleted(!deleted);
      fetchSubmissions();
    }
  };

  return (
    <div className="relative w-full">
      {showbox && (
        <>
          {/* Overlay with Blur */}
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 backdrop-blur-sm"></div>

          {/* Showbox Modal */}
          <div className="fixed z-50 h-[25vh] w-[40%] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 border border-gray-500 shadow-md rounded-lg flex flex-col items-center justify-center bg-black/70 text-white">
            <div className="input flex gap-3 justify-center items-center w-full">
              <h1 className="font-bold">Name:</h1>
              <input
                onChange={handleName}
                placeholder="Name of Submission"
                className="bg-black border border-gray-500 rounded-md p-1"
                required
              />
            </div>
            <div className="flex justify-center w-full mt-8 gap-28">
              <button
                onClick={() => setShowBox(false)}
                className="p-1.5 rounded-md w-[65px] border border-gray-500"
              >
                Cancel
              </button>
              <button
                disabled={!name}
                onClick={handlesubmissionsave}
                className="p-1.5 bg-white w-[65px] text-black rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content with Conditional Blur */}
      <div
        className={`w-full flex items-center justify-center mt-1 gap-1 ${
          showbox ? "filter blur-sm" : ""
        }`}
      >
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Submissions Sidebar */}
        <div className="w-[20%] h-[80.5vh] bg-[#1e1e1e] rounded-xl flex flex-col items-center p-1 border border-gray-700 border-b-4 border-r-4">
          <h1 className="p-1 mt-1 text-white backdrop-blur-2xl">
            My submissions
          </h1>
          <hr className="text-white w-full mt-[1px]" />

          {isSignedIn ? (
            <div className="w-full mt-1 overflow-y-auto">
              {Array.isArray(userSubs) && userSubs.length > 0 ? (
                userSubs.map((sub) => (
                  <Submission
                    key={sub._id}
                    submission={sub}
                    isSelected={sub._id === selectedSubmissionId}
                    onClick={() => handleSubmissionClick(sub._id, sub.code)}
                  />
                ))
              ) : (
                <p className="text-white text-center">No submissions found.</p> // Optional: show a message if no submissions are available
              )}
            </div>
          ) : (
            <h1 className="text-white">Please Sign In to save your code</h1>
          )}
        </div>

        {/* Code Editor */}
        <div className="w-[50%] h-[80.5vh] rounded-xl">
          <Editor
            language={language?.value}
            value={code}
            height="80.5vh"
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

        {/* Output and Controls */}
        <div className="h-[80.5vh] w-[30%] flex flex-col gap-2 mr-1">
          <div className="text-white bg-[#1e1e1e] p-1 h-[43vh] rounded-xl overflow-auto">
            <h1>OUTPUT:</h1>
            <hr />
            <OutputWindow outputDetails={outputDetails} />
          </div>
          <div className="items-end flex flex-col">
            <textarea
              id={id}
              name="customInput"
              placeholder="Enter text for custom Input"
              className="p-1 border border-black border-b-4 border-r-4 rounded-xl w-full overflow-auto"
              rows={3}
              onChange={(e) => setcustomInput(e.target.value)}
            />
            <div className="flex items-start w-full justify-around ">
              {isSignedIn && (
                <>
                  {!selectedSubmissionId && (
                    <button
                      onClick={() => setShowBox(true)}
                      className="border mt-1 text-white bg-purple-600 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-1"
                    >
                      Save Code
                    </button>
                  )}
                  {selectedSubmissionId && (
                    <>
                      <button
                        onClick={updateSub}
                        className="border mt-1 text-white bg-purple-600 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-1"
                      >
                        Update Code
                      </button>
                      <button
                        onClick={handledelete}
                        className="border mt-1 text-white bg-red-500 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-2"
                      >
                        <FaRegTrashAlt />
                      </button>
                      <button
                        onClick={handlereset}
                        className="border mt-1 text-white bg-blue-600 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-1"
                      >
                        New File
                      </button>
                    </>
                  )}
                </>
              )}
              <button
                disabled={!code}
                onClick={handleonclick}
                className="border mt-1 border-t-0 border-l-0 border-black text-white bg-green-600 border-b-4 border-r-4 rounded-lg p-1"
              >
                {processing ? "Processing..." : "Execute"}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start border border-black border-b-4 border-r-4 rounded-xl p-1 ">
            <h1 className="font-bold">
              Status: {outputDetails?.status?.description}{" "}
            </h1>
            <h1 className="font-bold">Memory: {outputDetails?.memory} </h1>
            <h1 className="font-bold">Time: {outputDetails?.time} </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSpace;
