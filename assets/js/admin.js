const SUPABASE_URL =
    "https://mythodsrinfvekslpyuy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_pkmIK26BJujYagpeX_lZ5Q_jv5ADc0X";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


async function verificarLogin() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error || !data.session) {

        window.location.replace("login.html");

        return false;
    }

    return true;
}


async function pegarProdutos() {

    const { data, error } =
        await supabaseClient
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

    return data || [];
}


async function mostrarProdutosAdmin() {

    const lista =
        document.getElementById("lista-admin");

    const contador =
        document.getElementById("contador");

    if (!lista || !contador) {
        return;
    }

    const produtos =
        await pegarProdutos();

    lista.innerHTML = "";

    contador.textContent =
        produtos.length === 1
            ? "1 peca"
            : `${produtos.length} pecas`;

    if (produtos.length === 0) {

        lista.innerHTML = `
            <div class="sem-produtos">
                <p>Nenhuma peca cadastrada ainda.</p>
            </div>
        `;

        return;
    }

    produtos.forEach(function(produto) {

        const card =
            document.createElement("div");

        card.classList.add(
            "produto-admin"
        );

        card.innerHTML = `
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >

            <div class="produto-admin-info">

                <div class="produto-admin-categoria">
                    ${produto.categoria}
                </div>

                <div class="produto-admin-nome">
                    ${produto.nome}
                </div>

                <div class="produto-admin-preco">
                    ${produto.preco}
                </div>

                <div class="produto-admin-tamanho">
                    Tamanhos: ${produto.tamanho}
                </div>

                <div class="acoes-produto">

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarProduto(${produto.id})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirProduto(${produto.id})"
                    >
                        Excluir peca
                    </button>

                </div>

            </div>
        `;

        lista.appendChild(card);

    });
}


async function editarProduto(id) {

    console.log(
        "Editando produto ID:",
        id
    );

    const { data, error } =
        await supabaseClient
            .from("produtos")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {

        console.error(
            "Erro ao carregar produto:",
            error
        );

        alert(
            "Nao foi possivel carregar o produto."
        );

        return;
    }


    document.getElementById("nome").value =
        data.nome || "";

    document.getElementById("preco").value =
        data.preco || "";

    document.getElementById("categoria").value =
        data.categoria || "";

    document.getElementById("tamanho").value =
        data.tamanho || "";


    const formulario =
        document.getElementById(
            "form-produto"
        );

    formulario.dataset.editandoId =
        id;


    const imagemAtual =
        document.getElementById(
            "imagem-atual"
        );

    if (imagemAtual) {

        imagemAtual.innerHTML = `
            <div class="imagem-atual-label">
                FOTO ATUAL
            </div>

            <img
                src="${data.imagem}"
                alt="${data.nome}"
            >
        `;

    }


    const titulo =
        document.querySelector(
            ".formulario h2"
        );

    if (titulo) {

        titulo.textContent =
            "Editar produto";

    }


    const botao =
        document.querySelector(
            ".btn-adicionar"
        );

    if (botao) {

        botao.textContent =
            "Salvar alteracoes";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


async function enviarFormulario(event) {

    event.preventDefault();


    const formulario =
        document.getElementById(
            "form-produto"
        );

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();

    const preco =
        document
            .getElementById("preco")
            .value
            .trim();

    const categoria =
        document.getElementById(
            "categoria"
        ).value;

    const tamanho =
        document
            .getElementById("tamanho")
            .value
            .trim();

    const arquivo =
        document.getElementById(
            "imagem"
        ).files[0];

    const idEditando =
        formulario.dataset.editandoId;


    if (idEditando) {

        const dadosAtualizados = {

            nome: nome,

            preco: preco,

            categoria: categoria,

            tamanho: tamanho

        };


        if (arquivo) {

            const leitor =
                new FileReader();

            leitor.onload = async function() {

                dadosAtualizados.imagem =
                    leitor.result;

                await atualizarProduto(
                    idEditando,
                    dadosAtualizados
                );

            };

            leitor.readAsDataURL(
                arquivo
            );

            return;
        }


        await atualizarProduto(
            idEditando,
            dadosAtualizados
        );

        return;
    }


    if (!arquivo) {

        alert(
            "Escolha uma foto para o produto."
        );

        return;
    }


    const leitor =
        new FileReader();

    leitor.onload = async function() {

        const novoProduto = {

            nome: nome,

            preco: preco,

            categoria: categoria,

            tamanho: tamanho,

            imagem: leitor.result

        };


        const { data, error } =
            await supabaseClient
                .from("produtos")
                .insert([
                    novoProduto
                ])
                .select();


        if (error) {

            console.error(
                "Erro ao cadastrar:",
                error
            );

            alert(
                "Erro ao cadastrar produto."
            );

            return;
        }


        console.log(
            "Produto cadastrado:",
            data
        );


        formulario.reset();


        const imagemAtual =
            document.getElementById(
                "imagem-atual"
            );

        if (imagemAtual) {

            imagemAtual.innerHTML = "";

        }


        await mostrarProdutosAdmin();


        alert(
            "Produto adicionado com sucesso!"
        );

    };


    leitor.readAsDataURL(
        arquivo
    );

}


async function atualizarProduto(
    id,
    dados
) {

    console.log(
        "Atualizando produto:",
        id
    );

    const { data, error } =
        await supabaseClient
            .from("produtos")
            .update(dados)
            .eq("id", Number(id))
            .select("*");


    if (error) {

        console.error(
            "Erro ao atualizar:",
            error
        );

        alert(
            "Erro ao atualizar produto."
        );

        return;
    }


    if (!data || data.length === 0) {

        alert(
            "O produto nao foi alterado no banco de dados."
        );

        return;
    }


    const formulario =
        document.getElementById(
            "form-produto"
        );

    formulario.reset();

    delete formulario.dataset.editandoId;


    const imagemAtual =
        document.getElementById(
            "imagem-atual"
        );

    if (imagemAtual) {

        imagemAtual.innerHTML = "";

    }


    const titulo =
        document.querySelector(
            ".formulario h2"
        );

    if (titulo) {

        titulo.textContent =
            "Adicionar produto";

    }


    const botao =
        document.querySelector(
            ".btn-adicionar"
        );

    if (botao) {

        botao.textContent =
            "Adicionar peca";

    }


    await mostrarProdutosAdmin();


    alert(
        "Produto atualizado com sucesso!"
    );

}


async function excluirProduto(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta peca?"
        );

    if (!confirmar) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("produtos")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(
            "Erro ao excluir:",
            error
        );

        alert(
            "Nao foi possivel excluir o produto."
        );

        return;
    }


    await mostrarProdutosAdmin();

}


async function sair() {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Erro ao sair:",
            error
        );

        alert(
            "Nao foi possivel sair da conta."
        );

        return;
    }


    window.location.replace(
        "login.html"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    async function() {

        const btnSair =
            document.getElementById(
                "btn-sair"
            );

        if (btnSair) {

            btnSair.addEventListener(
                "click",
                sair
            );

        }


        const formulario =
            document.getElementById(
                "form-produto"
            );

        if (formulario) {

            formulario.addEventListener(
                "submit",
                enviarFormulario
            );

        }


        const logado =
            await verificarLogin();


        if (!logado) {
            return;
        }


        await mostrarProdutosAdmin();

    }
);