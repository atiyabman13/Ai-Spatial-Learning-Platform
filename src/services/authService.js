import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";


export const loginUser = async (email, password) => {

    return await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

};


export const registerUser = async (email, password) => {

    return await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

};