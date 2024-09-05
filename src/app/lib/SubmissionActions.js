'use server'
import axios from "axios";
import {auth} from '@clerk/nextjs/server'
import { dbconnect } from "./mongoose";
import Submission from "../models/Submission";
const {userId}=auth();

export const saveSubmission=async({name,code,languageId})=>{
    if(userId){
        try {
            dbconnect();
            const newSub= new Submission({
                userId,
                name,
                code,
                languageId,
            });
            await newSub.save();
        } catch (error) {
            if (error.response) {
                console.error('Error saving submission:', error.response.data.error);
            } else {
                console.error('An unexpected error occurred:', error.message);
            }
        }
    }
}

export const getSubmissions=async()=>{
    try {
        dbconnect();
        const submissions=await Submission.find({userId}).lean();
        const res = submissions.map(submission => ({
            ...submission,
            _id: submission._id.toString(), // Convert ObjectId to string
        }));
        
        return res;
    } catch (error) {
        if (error.response) {
            console.error('Error retrieving submissions:', error.response.data.error);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
}

export const getSumbissionbyID=async ({subID}) => {
    try {
        dbconnect();
        const res=await Submission.find({submissionId:subID});
        return res;
    } catch (error) {
        if (error.response) {
            console.error('Error retrieving submission:', error.response.data.error);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
}

export const updateSubmission=async({id,code, languageId})=>{
    try {
        dbconnect();
        const updatedSubmission=await Submission.findByIdAndUpdate(id,{code,languageId}, {new:true});
        if (!updatedSubmission) {
            throw new Error('Submission not found');
        }
        const plainSubmission = updatedSubmission._doc;
        plainSubmission._id = updatedSubmission._id.toString();
        return plainSubmission;
    } catch (error) {
        if (error.response) {
            console.error('Error retrieving submission:', error.response.data.error);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
}

export const deleteSubmission=async({id})=>{
    try {
        dbconnect();
        const deletedSubmission=await Submission.findByIdAndDelete(id)
        if (!deletedSubmission) {
            throw new Error('Submission not found');
        }
        const plainSubmission = deletedSubmission._doc;
        plainSubmission._id = deletedSubmission._id.toString();
        return plainSubmission;
    } catch (error) {
        if (error.response) {
            console.error('Error retrieving submission:', error.response.data.error);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
}   