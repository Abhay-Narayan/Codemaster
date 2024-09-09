import React from 'react';
import { languages } from './languages';
import { CiShare2 } from "react-icons/ci";
import { toast, ToastContainer } from 'react-toastify';

const Submission = ({ submission, isSelected, onClick, bgColor }) => {
  const language = languages.find((item) => item.id === submission.languageId);
  const lname = language?.name;
  const copycontent = 'https://codemaster-navy.vercel.app/submissions/' + submission.submissionId;

  const handlesharebutton = () => {
    navigator.clipboard.writeText(copycontent)
      .then(() => {
        alert('Submission Link copied to clipboard');
      });
  };

  // Determine the dynamic classes based on the selection and background color
  const isWhiteBg = bgColor === 'white';
  const containerClass = `
    mt-[2px] rounded-md w-full p-1 h-auto 
    ${isWhiteBg ? 'text-black border border-gray-400 shadow-none' : ' shadow-lg'} 
    ${isSelected ? (isWhiteBg ? 'bg-gray-400' : 'bg-white/80 text-black') : (isWhiteBg ? 'hover:bg-gray-300' : 'bg-white/10 hover:bg-white/20')}
    ring-1 ring-black/5 text-center hover:cursor-pointer flex items-center justify-between`;

  const shareIconClass = `
    w-[25px] h-[25px] hover:scale-110 
    ${isSelected && isWhiteBg ? 'hover:bg-[#1e1e1e] hover:text-white' : 'hover:bg-white hover:text-black'} 
    transition-all duration-500 border rounded-md border-gray-500`;

  return (
    <div className={containerClass} onClick={onClick}>
      <ToastContainer />
      <div className='text-start w-[90%]'>
        {submission.name}
      </div>
      <CiShare2 onClick={handlesharebutton} className={shareIconClass} />
    </div>
  );
};

export default Submission;
