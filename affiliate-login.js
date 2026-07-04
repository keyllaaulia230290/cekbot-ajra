import {
    auth,
    signInWithEmailAndPassword
} from "./firebase/config.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try{

        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        window.location.href = "affiliate-dashboard.html";

    }

    catch(error){

        alert("Email atau password salah.");

    }

});