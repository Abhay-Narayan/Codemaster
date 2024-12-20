"use client";
import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Toaster, toast } from "react-hot-toast";
import { handlecompile } from "./handlecompile";
import OutputWindow from "./outputwindow";
import { useUser } from "@clerk/nextjs";
import {
  deleteSubmission,
  getSubmissions,
  saveSubmission,
  updateSubmission,
} from "../lib/SubmissionActions";
import { FaRegTrashAlt } from "react-icons/fa";
import SubmissionSidebar from "./SubmissionSidebar";
import monacoThemes from "monaco-themes/themes/themelist.json";
import { lthemes } from "../constants/lighthemes";
import { getComplexity } from "../constants/ai_time_complexity";

const CodeSpace = ({ language, theme}) => {
  
  const { user, isSignedIn } = useUser();
  const [userId,setUserId]=useState(null);
  const id = Date.now().toString();
  const [code, setCode] = useState(`#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [name, setName] = useState("");
  const [userSubs, setUserSubs] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [bg,setBg]=useState('#1e1e1e')
  const [save,Setsave]=useState(false);
  const [complexity,setComplexity]=useState("");

  useEffect(()=>{
    if(user?.id)setUserId(user.id);
  },[])
  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissions = await getSubmissions(userId);
      setUserSubs(submissions);
      console.log(submissions)
    };
    fetchSubmissions();
  }, [save,userId]);

  const handleClick = async() => {
    await handlecompile(setProcessing, code, customInput, setOutputDetails, language);
    
  };

  const handleEditorChange = (value) => setCode(value);

  const handleSubmissionClick = (id, code) => {
    setSelectedSubmissionId(id);
    setCode(code);
  };

  const handleSaveSubmission = async () => {
    const data = saveSubmission({ name, code, languageId: language.id });
    if (data) {
      toast.success("Saved");
      Setsave(!save);
      setShowBox(false);
    }
  };

  const handleUpdateSubmission = async () => {
    const updated = await updateSubmission({ id: selectedSubmissionId, code, languageId: language.id });
    if (updated) {
      toast.success("Submission Updated ✅ ");
    }
  };

  const handleDeleteSubmission = async () => {
    const deleted = await deleteSubmission({ id: selectedSubmissionId });
    if (deleted) {
      toast.success("Submission Deleted");
      Setsave(!save)
      setSelectedSubmissionId(null);
      setCode(`#include<iostream>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`);
    }
  };

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    loadTheme(monaco, theme);
  };


  const loadTheme = async (monaco, themeName) => {
    try {
      if (themeName === "vs-dark" || themeName === "light") {
        monaco.editor.setTheme(themeName);
      } else if (monacoThemes[themeName]) {
        const themeData = await import(`monaco-themes/themes/${monacoThemes[themeName]}`);
        monaco.editor.defineTheme(themeName, themeData);
        monaco.editor.setTheme(themeName);
      } else {
        monaco.editor.setTheme("vs-dark");
      }
    } catch (error) {
      toast.error(`Failed to load theme ${themeName}. Using default.`);
      monaco.editor.setTheme("vs-dark");
    }
  };

  useEffect(() => {
    if (monacoRef.current) {
      loadTheme(monacoRef.current, theme); // Apply the theme when it changes
    }
    const loadThemeData = async (themeName) => {
      try {
        if(lthemes.includes(themeName)){
          setBg('white');
        }else{
          const themeData = await import(`monaco-themes/themes/${monacoThemes[themeName]}`);
          setBg(themeData.colors['editor.background']);
        }
        
        console.log(bg);
      } catch (error) {
        console.error(`Error loading theme data for ${themeName}:`, error);
        return null;
      }
    };
    loadThemeData(theme);
  }, [theme, bg]);

  const handlenewfile=()=>{
    setCode(`#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`);
    setSelectedSubmissionId(null);
  }

  const handleComplexity=async()=>{
    const res=await getComplexity(code);
    setComplexity(res);
    alert(res)
  }
  

  return (
    <div className="relative w-full">
      {showBox && (
        <>
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 backdrop-blur-sm"></div>
          <div className="fixed z-50 h-[25vh] w-[40%] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 border border-gray-500 shadow-md rounded-lg flex flex-col items-center justify-center bg-black/70 text-white">
            <div className="input flex gap-3 justify-center items-center w-full">
              <h1 className="font-bold">Name:</h1>
              <input
                onChange={(e) => setName(e.target.value)}
                placeholder="Name of Submission"
                className="bg-black border border-gray-500 rounded-md p-1"
                required
              />
            </div>
            <div className="flex justify-center w-full mt-8 gap-28">
              <button onClick={() => setShowBox(false)} className="p-1.5 rounded-md w-[65px] border border-gray-500">Cancel</button>
              <button disabled={!name} onClick={handleSaveSubmission} className="p-1.5 bg-white w-[65px] text-black rounded-md">Save</button>
            </div>
          </div>
        </>
      )}

      <div className={`w-full flex items-center justify-center mt-1 gap-1 ${showBox ? "filter blur-sm" : ""}`}>
        <Toaster />

        <SubmissionSidebar bgColor={bg} userSubs={userSubs} selectedSubmissionId={selectedSubmissionId} handleSubmissionClick={handleSubmissionClick} />

        <div className={`w-[50%] h-[80.5vh] border border-black`}>
          <Editor
            language={language?.value}
            value={code}
            height="80.5vh"
            theme={theme}
            width="100%"
            onMount={handleEditorDidMount}
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

        <div className="h-[80.5vh] w-[30%] flex flex-col gap-2 mr-1">
          <div style={{
            backgroundColor:bg
          }} 
          className={` border border-gray-500 ${bg=='white'? 'text-black':'text-white'} p-1 h-[43vh] rounded-xl overflow-auto`}>
            <h1>OUTPUT:</h1>
            <hr />
            <OutputWindow bgcolor={bg} outputDetails={outputDetails} />
          </div>
          <div className="items-end flex flex-col">
            <textarea
              id={id}
              name="customInput"
              placeholder="Enter text for custom Input"
              className="p-1 border border-black border-b-4 border-r-4 rounded-xl w-full overflow-auto"
              rows={3}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <div className="flex items-start w-full justify-around">
              {isSignedIn && (
                <>
                  {!selectedSubmissionId && (
                    <button onClick={() => setShowBox(true)} className="border mt-1 text-white bg-purple-600 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-1">Save Code</button>
                  )}
                  {selectedSubmissionId && (
                    <>
                      <button onClick={handleUpdateSubmission} className="border mt-1 text-white bg-purple-600 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-1">Update Code</button>
                      <button onClick={handleDeleteSubmission} className="border mt-1 text-white bg-red-500 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-2"><FaRegTrashAlt /></button>
                      <button onClick={handlenewfile} className="border mt-1 text-white bg-blue-600 border-black border-t-0 border-l-0 border-b-4 border-r-4 rounded-lg p-1">New File</button>
                    </>
                  )}
                </>
              )}
              <button disabled={!code} onClick={handleClick} className="border mt-1 border-t-0 border-l-0 border-black text-white bg-green-600 border-b-4 border-r-4 rounded-lg p-1">
                {processing ? "Processing..." : "Execute"}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start border border-black border-b-4 border-r-4 rounded-xl p-1">
            <h1 className="font-bold">Status: {outputDetails?.status?.description}</h1>
            <h1 className="font-bold">Memory: {outputDetails?.memory}</h1>
            <h1 className="font-bold">Time: {outputDetails?.time}</h1>
            <button disabled={!code} onClick={handleComplexity} className="border mt-1 border-t-0 border-l-0 border-black text-white bg-green-600 border-b-4 border-r-4 rounded-lg p-1">
                Analyze Complexity
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSpace;
