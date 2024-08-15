import dbconnect from "../lib/mongoose";
import Submission from "../models/Submission";

export default async function handler(req,res){
    const method = req;
    await dbconnect();

    switch (method){
        case 'POST':
            try {
                const {userId, name, languageId}=req.body;
                if(!userId || !name || !languageId){
                    return res.status(400).json({ success: false, error: 'All fields are required' });
                }

                const submission= new Submission({
                    userId,
                    name, 
                    languageId
                });

                await Submission.Save();
                res.status(201).json({success:true,data:submission});
            } catch (error) {
                res.status(400).json({success:false,error:error.message})
            }
            break;
        case 'GET':
            try {
                const {userId}= req.body
                if(!userId){
                    return res.status(400).json({ success: false, error: 'userId is required' });
                }

                const submission= await Submission.find({userId});
                return res.status(201).json({success:true, data: submission});
                
            } catch (error) {
                res.status(400).json({success:false,error:error.message})
            }
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}