import {
    db,
    auth,
    ref,
    set,
    get,
    createUserWithEmailAndPassword
} from "./firebase/config.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const email = document.getElementById("email").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agree = document.getElementById("agree").checked;

    if (!agree) {
        alert("Silakan setujui syarat & ketentuan.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Password tidak sama.");
        return;
    }

    if (!whatsapp.startsWith("62")) {
        alert("Nomor WhatsApp harus diawali 62.");
        return;
    }

    try {

        // Buat akun Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const uid = userCredential.user.uid;

        // Generate kode referral sederhana
        const referralCode = "AJRA" + Date.now().toString().slice(-6);

        // Simpan ke Realtime Database
        await set(ref(db, "affiliates/" + uid), {

            nama,
            username,
            email,
            whatsapp,

            referralCode,

            komisi: 0,
            pending: 0,
            withdraw: 0,
            totalReferral: 0,

            createdAt: Date.now()

        });

        alert("Pendaftaran berhasil!");

        window.location.href = "affiliate-login.html";

    } catch (err) {

        console.log(err);

        alert(err.code + "\n" + err.message);
 
    }

});