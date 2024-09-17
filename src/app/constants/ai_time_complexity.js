'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getComplexity=async(code)=>{
    console.log(process.env.GOOGLE_API)
    const prompt=`identify the time complexity of below code and just return with the time complexity and space complexity nothing else Code- ${code} dont explain anything `;
    const res=await model.generateContent(prompt);
    console.log(res.response.text());
    return res.response.text();
}