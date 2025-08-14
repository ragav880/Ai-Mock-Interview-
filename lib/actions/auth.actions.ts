'use server';

import { db , auth } from "@/firebase/admin";
import { cookies } from "next/headers";
export async function signUp(params:SignUpParams){
    const {uid,name,email,password} = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists) {
            return {
                success: false,
                message: "User already exists"
            };
        }
        await db.collection('users'). doc(uid).set({
            name,email
        })
        return{
            success: true,
            message: "User created successfully"
        }
        
    } catch (error:any) {
        console.error("Error signing up:", error);

        if(error.code === 'auth/email-already-exists') {
            
            return{
                success: false,
                message: "Email already exists. Please use a different email."
            }
        }
        return{
            success: false,
            message: "Falied to create account"
        }
    }
}

export async function signIn(params:SignInParams) {
    const {email, idToken} = params;
    try {

        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord) {
            return {
                success: false,
                message: "User not found"
            };
        }
        await setSessionCookie(idToken);
        return {
            success: true,
            message: "Sign in successful"
        };
        
    } catch (error) {
        console.error("Error signing in:", error);
        return{
            success: false,
            message: "Failed to sign in"
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: 60 * 60 * 24 * 7 *100, // 7 days
    })
    cookieStore.set('session', sessionCookie,{
            maxAge: 60 * 60 * 24 * 7, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',

        } )
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.
        collection('users').
        doc(decodedClaims.uid).get();
        
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
        
    } catch (error) {
        console.log(error);
        return null;
    }

}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user;

}

export async function getInterviewByUserId(userId:string):Promise<Interview[] | null>{
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