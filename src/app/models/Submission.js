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
        require:true
    },
    name:{
        type:String,
        require:true
    },
    languageId:{
        type:Number,
        require:true
    }
})

export default mongoose.models.Submission || mongoose.model('Submission',SubmissionSchema);