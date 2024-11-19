'use server'
import mongoose from 'mongoose';
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

export const getSubmissions=async(id)=>{
    try {
        dbconnect();
        const submissions=await Submission.find({id}).lean();
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

export const getSubmissionByID = async ({ subID }) => {
    try {
        dbconnect();
        const res = await Submission.findOne({ submissionId: subID }); // use findOne for a single document
        if (!res) {
            throw new Error(`Submission with ID ${subID} not found`);
        }
        const plainSubmission = res.toObject(); // Converts the document to a plain object
        plainSubmission._id = res._id.toString(); // Convert ObjectId to string
        return plainSubmission;
    } catch (error) {
        if (error.response) {
            console.error('Error retrieving submission:', error.response.data.error);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
};


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