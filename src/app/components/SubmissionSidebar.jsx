import { useState, useEffect } from 'react';
import Submission from './Submission'
import { useUser } from "@clerk/nextjs";
import { IoIosSearch } from "react-icons/io";

const SubmissionSidebar = ({singlesub, userSubs, handleSubmissionClick, selectedSubmissionId, subpage}) => {
    const { isSignedIn } = useUser();
    const [filterSubs, setFilterSubs] = useState(userSubs);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilterSubs(userSubs);
    }, [userSubs]);

    useEffect(() => {
        if(searchTerm) {
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
        <div className={`w-[20%] h-[${ht}] bg-[#1e1e1e] rounded-xl flex flex-col items-center p-1 border border-gray-700 border-b-4 border-r-4`}>
            <h1 className="p-1 mt-1 text-white backdrop-blur-2xl">
                My submissions
            </h1>
            <hr className="text-white w-full mt-[1px]" />
            <div className='w-full relative'>
                <input 
                    className='bg-white/10 text-white border border-gray-800 focus:outline-none mt-1 rounded-md p-1.5 w-full focus:bg-white/20' 
                    type='text' 
                    placeholder='Search Submissions' 
                    onChange={handleOnChange}
                    value={searchTerm}
                />
                <IoIosSearch className='absolute right-1 top-2.5 text-2xl text-white' />
            </div>

            {isSignedIn ? (
                <div className="w-full mt-1 overflow-y-auto">
                    {Array.isArray(filterSubs) && filterSubs.length > 0 ? (
                        filterSubs.map((sub) => (
                            <Submission
                                key={sub._id}
                                submission={sub}
                                isSelected={sub._id === selectedSubmissionId}
                                onClick={() => handleSubmissionClick(sub._id, sub.code)}
                            />
                        ))
                    ) : (
                        !singlesub &&(
                            <p className="text-white text-center">No submissions found.</p>

                        )
                    )}
                </div>
            ) : (
                <h1 className="text-white">Please Sign In to save your code</h1>
            )}
            {singlesub && (
                <Submission submission={singlesub} isSelected={true} />
            )}
        </div>
    )
}

export default SubmissionSidebar