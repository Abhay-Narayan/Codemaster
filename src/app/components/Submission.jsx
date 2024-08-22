import React from 'react'
import { languages } from './languages'

const Submission = ({submission, isSelected, onClick}) => {
  const language=languages.find((item)=>item.id===submission.languageId);
  const lname=language.name;
  const textColor = isSelected ? 'black' : 'white';
  return (
    <div
      onClick={onClick}
      className={`mt-[2px] rounded-md w-full p-1 text-${textColor} ${isSelected? 'bg-white':'bg-white/10'} shadow-lg ring-1 ring-black/5 text-center ${!isSelected && 'hover:bg-white/20'} hover:cursor-pointer`}
    >
      {submission.name}&nbsp;-&nbsp;{lname}
    </div>
  )
}

export default Submission