'use client'
import React, { useState } from 'react'
import Editor from "@monaco-editor/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handlecompile } from './handlecompile';
import OutputWindow from './outputwindow';
import { useUser } from "@clerk/nextjs";
import Submission from './Submission';

const CodeSpace = ({ language }) => {
  const {user, isSignedIn}= useUser();
  const id= Date.now().toString();
  const [code, setCode] = useState(`#include<iostream>\nusing namespace std;\n\nint main(){\n   cout<<"wtspp mate!!";\n   return 0; \n}`);
  const [customInput, setcustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleonclick = () => {
    handlecompile(setProcessing, code, customInput, setOutputDetails, language);
  }

  const onchange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        //console.log(data);
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

  return (
    <div className='w-full flex items-center justify-center mt-1 gap-1'>
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
      <div className='w-[20%] h-[80.5vh] bg-[#1e1e1e] rounded-xl flex flex-col items-center p-1 border border-gray-700 border-b-4 border-r-4'>
        <h1 className='p-1 mt-1 text-white backdrop-blur-2xl'>My submissions </h1>
        <hr className='text-white w-full mt-[1px]'/>

        {isSignedIn?(<div className='w-full mt-1'>
          <Submission/>
          <Submission/>
          <Submission/>
          <Submission/>
          <Submission/>
          <Submission/>
          <Submission/>
        </div>):(<h1 className='text-white'>Please Sign In to save your code</h1>)}
        
      </div>
      <div className='w-[50%] h-[80.5vh] rounded-xl'>
      <Editor
        language={language?.value}
        value={code}
        height="80.5vh"
        theme='vs-dark'
        width="100%"
        onChange={handleEditorChange}
        options={{
          inlineSuggest: true,
          fontSize: "17px",
          formatOnType: true,
          autoClosingBrackets: true,
          minimap: { scale: 10 },
          bracketPairColorization: true,    
          wordWrap:'on',
          smoothScrolling:true,     
        }}
      />
      </div>
      
      <div className='h-[80.5vh] w-[30%] flex flex-col gap-2 mr-1'>
        <div className='text-white bg-[#1e1e1e] p-1 h-[43vh] rounded-xl overflow-auto'>
          <h1>OUTPUT:</h1>
          <hr />
          <OutputWindow outputDetails={outputDetails} />
        </div>
        <div className='items-end flex flex-col'>
          <textarea
          id={id}
            name='customInput'
            placeholder='Enter text for custom Input'
            className='p-1 border border-black border-b-4 border-r-4 rounded-xl w-full overflow-auto'
            rows={3}
            // cols={42}
            onChange={(e) => setcustomInput(e.target.value)}
          />
          <div className='flex items-start w-full justify-around'>
            {isSignedIn && (<button className='border mt-1 text-white bg-purple-600 border-black border-t-0 border-l-0  border-b-4 border-r-4 rounded-lg p-1'>
              Save Code
            </button>)}
            <button
              disabled={!code}
              onClick={handleonclick}
              className='border mt-1 border-black  border-b-4 border-r-4 rounded-lg p-1'
            >
              {processing ? "Processing..." : "Execute"}
            </button>
          </div>
         
        </div>
        <div className='flex flex-col items-start border border-black border-b-4 border-r-4 rounded-xl p-1 '>
          <h1 className='font-bold'>Status: {outputDetails?.status?.description} </h1>
          <h1 className='font-bold'>Memory: {outputDetails?.memory} </h1>
          <h1 className='font-bold'>Time: {outputDetails?.time} </h1>
        </div>
      </div>
    </div>
  )
}

export default CodeSpace;
