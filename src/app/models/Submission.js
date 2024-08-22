import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid';

const SubmissionSchema=new mongoose.Schema({
    submissionId: {
        type: String,
        unique: true,
        default: uuidv4, // Automatically generate a unique ID using UUID
      },
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    languageId:{
        type:Number,
        required:true
    },
    code:{
        type:String,
        required:true
    }
})

export default mongoose.models.Submission || mongoose.model('Submission',SubmissionSchema);