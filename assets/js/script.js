/* =====================================================
   ZAYRA
   SCRIPT.JS
   CATALOGO PUBLICO
===================================================== */


/* =====================================================
   SUPABASE
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


/* =====================================================
   CRIAR CARD
===================================================== */

function criarProduto(produto) {

    const card =
        document.createElement("div");

    card.classList.add("produto");


    const mensagem =
        "Ola! Tenho interesse na peca " +
        produto.nome +
        ". Gostaria de saber mais informacoes.";


    const linkWhatsapp =
        "https://wa.me/5500000000000?text=" +
        encodeURIComponent(mensagem);


    card.innerHTML = `

        <div class="produto-imagem">

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                loading="lazy"
            >

        </div>


        <div class="produto-info">

            <div class="produto-categoria">
                ${produto.categoria}
            </div>


            <div class="produto-nome">
                ${produto.nome}
            </div>


            <div class="produto-preco">
                ${produto.preco}
            </div>


            <div class="produto-tamanho">
                Tamanhos: ${produto.tamanho}
            </div>


            <a
                href="${linkWhatsapp}"
                class="produto-btn"
                target="_blank"
                rel="noopener noreferrer"
            >
                Tenho interesse
            </a>

        </div>

    `;


    return card;
}


/* =====================================================
   BUSCAR PRODUTOS
===================================================== */

async function pegarProdutos() {

    console.log(
        "ZAYRA: buscando produtos..."
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("produtos")
        .select("*")
        .order("id", {
            ascending: false
        });


    if (error) {

        console.error(
            "Erro ao buscar produtos:",
            error
        );

        return [];

    }


    console.log(
        "ZAYRA: produtos encontrados:",
        data
    );


    return data || [];

}


/* =====================================================
   LIMPAR LISTAS
===================================================== */

function limparListas() {

    const listas = [

        "lista-produtos",

        "lista-vestidos",

        "lista-tops",

        "lista-calcas",

        "lista-conjuntos"

    ];


    listas.forEach(function(id) {

        const elemento =
            document.getElementById(id);


        if (elemento) {

            elemento.innerHTML = "";

        }

    });

}


/* =====================================================
   MOSTRAR PRODUTOS
===================================================== */

async function mostrarProdutos() {

    console.log(
        "ZAYRA: carregando catalogo..."
    );


    limparListas();


    const produtos =
        await pegarProdutos();


    /* =================================================
       NENHUM PRODUTO
    ================================================= */

    if (produtos.length === 0) {

        const lista =
            document.getElementById(
                "lista-produtos"
            );


        if (lista) {

            lista.innerHTML = `

                <div class="sem-produtos">

                    <p>
                        Nenhuma peca cadastrada ainda.
                    </p>

                </div>

            `;

        }


        return;

    }


    /* =================================================
       MAPA DAS CATEGORIAS
    ================================================= */

    const mapaCategorias = {

        "Vestidos":
            "lista-vestidos",

        "Tops":
            "lista-tops",

        "Calcas":
            "lista-calcas",

        "Calças":
            "lista-calcas",

        "Conjuntos":
            "lista-conjuntos"

    };


    /* =================================================
       ADICIONAR PRODUTOS
    ================================================= */

    produtos.forEach(function(produto) {


        /* ---------------------------------------------
           LISTA PRINCIPAL
        --------------------------------------------- */

        const listaPrincipal =
            document.getElementById(
                "lista-produtos"
            );


        if (listaPrincipal) {

            listaPrincipal.appendChild(
                criarProduto(produto)
            );

        }


        /* ---------------------------------------------
           LISTA DA CATEGORIA
        --------------------------------------------- */

        const idCategoria =
            mapaCategorias[
                produto.categoria
            ];


        if (!idCategoria) {

            console.warn(
                "Categoria nao encontrada:",
                produto.categoria
            );

            return;

        }


        const listaCategoria =
            document.getElementById(
                idCategoria
            );


        if (listaCategoria) {

            listaCategoria.appendChild(
                criarProduto(produto)
            );

        }

    });


    console.log(
        "ZAYRA: catalogo carregado com sucesso."
    );

}


/* =====================================================
   INICIAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarProdutos();

    }
);

