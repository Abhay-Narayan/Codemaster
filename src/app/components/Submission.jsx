import React from 'react'
import { languages } from './languages'
import { CiShare2 } from "react-icons/ci";
import { toast, ToastContainer } from 'react-toastify';

const Submission = ({submission, isSelected, onClick}) => {
  const language=languages.find((item)=>item.id===submission.languageId);
  const lname=language.name;
  const textColor = isSelected ? 'black' : 'white';
  const copycontent='https://codemaster-navy.vercel.app/submissions/'+submission.submissionId;
  const handlesharebutton=()=>{
    navigator.clipboard.writeText(copycontent)
    .then(()=>{
      alert('Submission Link copied to clipboard')
    })
  }

  return (
    <div  
      className={`mt-[2px] rounded-md w-full p-1 h-auto text-${textColor} ${isSelected? 'bg-white/80':'bg-white/10'} shadow-lg ring-1 ring-black/5 text-center ${!isSelected && 'hover:bg-white/20'} hover:cursor-pointer flex items-center justify-between`}
    >
      <ToastContainer/>
      <div onClick={onClick} className='text-start w-[90%]'>
        {submission.name}
      </div>
      <CiShare2 onClick={handlesharebutton} className={`w-[25px] h-[25px] hover:scale-110 ${isSelected? 'hover:bg-[#1e1e1e] hover:text-white':'hover:bg-white hover:text-black'} transition-all duration-500 border rounded-md border-gray-500`} />
    </div>
  )
}

export default Submission