/* =====================================================
   ZAYRA
   LOGIN.JS
===================================================== */

const SUPABASE_URL =
    "https://mythodsrinfvekslpyuy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_pkmIK26BJujYagpeX_lZ5Q_jv5ADc0X";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =====================================================
// FORMULÁRIO DE LOGIN
// =====================================================

const formulario =
    document.getElementById("form-login");

const erroLogin =
    document.getElementById("erro-login");


formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        erroLogin.textContent = "";


        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;


        // LOGIN NO SUPABASE

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: senha

            });


        // ERRO

        if (error) {

            console.error(
                "Erro no login:",
                error
            );

            erroLogin.textContent =
                "E-mail ou senha incorretos.";

            return;
        }


        // LOGIN REALIZADO

        console.log(
            "Login realizado com sucesso!"
        );


        // IR PARA O PAINEL

        window.location.href =
            "admin.html";

    }
);