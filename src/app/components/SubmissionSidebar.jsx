import { useState, useEffect ,useMemo } from 'react';
import Submission from './Submission';
import { useUser } from "@clerk/nextjs";
import { IoIosSearch } from "react-icons/io";

const SubmissionSidebar = ({
    singlesub,
    userSubs = [],
    handleSubmissionClick,
    selectedSubmissionId,
    subpage,
    bgColor
  }) => {
    const { isSignedIn } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
  
    const filterSubs = useMemo(() => {
        return userSubs.filter((sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [userSubs, searchTerm]);
  
    const handleOnChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const containerHeight = subpage ? "h-[90vh]" : "h-[80.5vh]";
    const textColor = bgColor === 'white' ? 'text-black' : 'text-white';
  
    const renderSubmissionsList = () => {
      if (!isSignedIn) {
        return (
          <div className="w-full text-center mt-4">
            <h1>Please Sign In to save your code</h1>
          </div>
        );
      }
  
      if (singlesub) {
        return (
          <div className="w-full mt-1">
            <Submission 
              submission={singlesub} 
              isSelected={true} 
              bgColor={bgColor} 
            />
          </div>
        );
      }
  
      if (filterSubs.length === 0) {
        return (
          <div className="w-full text-center mt-4">
            <p>No submissions found.</p>
          </div>
        );
      }
  
      return (
        <div className="w-full mt-1 overflow-y-auto">
          {filterSubs.map((sub) => (
            <Submission
              key={sub._id}
              bgColor={bgColor}
              submission={sub}
              isSelected={sub._id === selectedSubmissionId}
              onClick={() => handleSubmissionClick(sub._id, sub.code)}
            />
          ))}
        </div>
      );
    };
  
    return (
      <div
        className={`w-[20%] rounded-xl flex flex-col items-center p-1 border border-gray-700 border-b-4 border-r-4 transition-none ${containerHeight} ${textColor}`}
        style={{ backgroundColor: bgColor }}
      >
        <h1 className="p-1 mt-1 backdrop-blur-2xl">My Submissions</h1>
        <hr className="w-full mt-[1px]" />
  
        <div className="w-full relative">
          <input
            className="bg-white/10 border border-gray-800 focus:outline-none mt-1 rounded-md p-1.5 w-full focus:bg-white/20"
            type="text"
            placeholder="Search Submissions"
            onChange={handleOnChange}
            value={searchTerm}
          />
          <IoIosSearch
            className={`absolute right-1 top-2.5 text-2xl ${textColor}`}
          />
        </div>
  
        {renderSubmissionsList()}
      </div>
    );
  };

export default SubmissionSidebar;
