'use server'

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { success } from "zod";

export async function getInterviewsByUserId(userId:string):Promise<Interview[] | null>{
    console.log("intbyusid func called")
    console.log('userid iss ',userId)
    const Interview = await db.collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
    return Interview.docs.map((doc) =>({
        id : doc.id,
        ...doc.data(),

    })) as Interview[];

}

export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[] | null>{
    console.log("getlat int clled")
    const {userId, limit = 20} = params; 
    const Interviews = await db.collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finalized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get();
    return Interviews.docs.map((doc) =>({
        id : doc.id,
        ...doc.data(),

    })) as Interview[];

}

export async function getInterviewById(id:string):Promise<Interview | null>{
    console.log("intbyusid func called")
    const interview = await db.collection('interviews')
    .doc(id)
    .get()
    return interview.data() as Interview | null

}
