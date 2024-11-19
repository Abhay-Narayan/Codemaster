import { useState, useEffect } from 'react';
import Submission from './Submission'
import { useUser } from "@clerk/nextjs";
import { IoIosSearch } from "react-icons/io";

const SubmissionSidebar = ({singlesub, userSubs, handleSubmissionClick, selectedSubmissionId, subpage, bgColor}) => {
    const { isSignedIn } = useUser();
    const [filterSubs, setFilterSubs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilterSubs(userSubs);
    }, [userSubs]);

    useEffect(() => {
        if(searchTerm.trim()) {
            setFilterSubs(
                userSubs.filter((sub) => 
                    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilterSubs(userSubs);
        }
    }, [searchTerm, userSubs]);

    const handleOnChange = (e) => {
        setSearchTerm(e.target.value);
    }
    const ht=subpage? "90vh":"80.5vh"
    return (
        <div style={{
            backgroundColor:bgColor
          }} 
        className={`w-[20%] h-[${ht}] ${bgColor=='white'? 'text-black':'text-white'} rounded-xl flex flex-col items-center p-1 border border-gray-700 border-b-4 border-r-4 transition-none`}>
            <h1 className="p-1 mt-1 backdrop-blur-2xl">
                My submissions
            </h1>
            <hr className=" w-full mt-[1px]" />
            <div className='w-full relative'>
                <input 
                    className='bg-white/10  border border-gray-800 focus:outline-none mt-1 rounded-md p-1.5 w-full focus:bg-white/20' 
                    type='text' 
                    placeholder='Search Submissions' 
                    onChange={handleOnChange}
                    value={searchTerm}
                />
                <IoIosSearch className={`absolute right-1 top-2.5 text-2xl  ${bgColor=='white'? 'text-black':'text-white'} `} />
            </div>

            {isSignedIn ? (
                <div className="w-full mt-1 overflow-y-auto">
                    {Array.isArray(filterSubs) && filterSubs.length > 0 ? (
                        filterSubs.map((sub) => (
                            <Submission
                                bgColor={bgColor}
                                key={sub._id}
                                submission={sub}
                                isSelected={sub._id === selectedSubmissionId}
                                onClick={() => handleSubmissionClick(sub._id, sub.code)}
                            />
                        ))
                    ) : (
                        !singlesub &&(
                            <p className={`text-center`}>No submissions found.</p>

                        )
                    )}
                </div>
            ) : (
                <h1 className="">Please Sign In to save your code</h1>
            )}
            {singlesub && (
                <Submission submission={singlesub} isSelected={true} />
            )}
        </div>
    )
}

export default SubmissionSidebar