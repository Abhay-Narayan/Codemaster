'use client'
import { useState } from "react";
import CodeSpace from "./components/CodeSpace";
import { languages } from "./components/languages";
import dynamic from 'next/dynamic';
const Select = dynamic(() => import("react-select"), { ssr: false });

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    marginTop:'1px',
    border: '1px solid #1e1e1e', // Default border
    borderBottom: '4px solid #1e1e1e' , 
    borderRight:'4px solid #1e1e1e' ,
    boxShadow: 'none', // Remove the default box shadow
    '&:hover': {
        border: '1px solid #1e1e1e', // Keep the same border on hover
        borderBottom: '4px solid #1e1e1e', // Shadow-like bottom border on hover
        borderRight:'4px solid #1e1e1e' 
    },
    '&:focus': {
        border: '1px solid #1e1e1e', // Keep the same border on focus
        borderBottom: '2px solid rgba(30, 30, 30, 0.5)', // Shadow-like bottom border on focus
        borderRight:'4px solid #1e1e1e' 
    }
  }),
};


export default function Home() {
  const [language, setlanguage] = useState(languages[1]);
  const id= Date.now().toString();
  return (
    <div className="flex flex-col items-center justify-center">
      <Select
        id={id}
        placeholder={`Filter By Category`}
        options={languages}
        defaultValue={languages[1]}
        onChange={(selectedOption) => setlanguage(selectedOption)}
        styles={customStyles}
    />
      <CodeSpace language={language} />
    </div>
  );
}
