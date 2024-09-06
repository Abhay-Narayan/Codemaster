'use client'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { useUser } from "@clerk/nextjs";
import Link from 'next/link';

const Navbar = () => {
  const {user, isSignedIn}= useUser();
  return (
    <nav className="bg-gray-200 shadow-lg border-gray-300 rounded-xl ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href='/'> 
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              CODEMASTER
            </span>
          </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className='flex'>
          <SignedOut>
            <SignInButton className="p-2 bg-purple-600 text-white rounded-lg " />
          </SignedOut>
          <SignedIn>
            {isSignedIn &&(<h1 className='mr-2'>Welcome, {user.firstName} </h1>)}
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
