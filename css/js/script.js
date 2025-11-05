

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("https://lpportfolio-jhondev.onrender.com/listComments");

        if (!response.ok) {
            throw new Error(`Erro ao buscar comentários: ${response.status}`);
        }

        var comentarios = await response.json();
        console.log(comentarios); // array de comentários

    } catch (error) {
        console.error(error);
    }



    function gerarEstrelas(avaliacao) {
        const totalEstrelas = 5;
        const estrelas = Math.round(avaliacao / 2); // Converte 0-10 para 0-5
        let html = '';

        for (let i = 0; i < totalEstrelas; i++) {
            if (i < estrelas) {
                html += '<i class="fa-solid fa-star text-warning"></i>';
            } else {
                html += '<i class="fa-regular fa-star text-warning"></i>';
            }
        }
        return html;
    }

    async function addComentario(nome, descricao, nota) {
        try {
            
            const response = await fetch("https://lpportfolio-jhondev.onrender.com/addNewComment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"

                },

                body: JSON.stringify({ nome, descricao, nota })
            });

            const data = await response.json();
            if (response.status === 409) {
                alert(data.menssagem)
                return; // interrompe a função
            }
            if (!response.ok) {
                throw new Error(data.error || "Erro ao adicionar o comentários");
            }

            console.log("Comentário adicionado:", data);
            gerarComentario();
            window.location.reload();
        } catch (error) {
            console.log(error)
        }


    }


    function gerarComentario() {
        const rowComments = document.querySelector(".rowComments");
        const layerCarrosel = document.querySelector(".carousel-inner");

        if (comentarios.length <= 3 && rowComments) {
            // Renderiza em grid estático
            for (let i = 0; i < comentarios.comments.length; i++) {
                const html = `
            <div class="col-md-3 item-carousel">
                        <div class="card shadow  ">
                            <h3 class="text-center p-2">Comentário</h3>
                            <div class="card-body p-3">
                                <div class="border border-primary h-100">
                                    <div>
                                        <p class="card-text fs-5">"${comentarios[j].descricao}"</p>
                                    </div>
                                    <div class="d-flex justify-content-around">
                                        <div class="card-title">${gerarEstrelas(comentarios[j].nota)}</div>
                                        <h6 class="card-title">${comentarios[j].nome}</h6> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                rowComments.insertAdjacentHTML("beforeend", html);
            }
        } else if (layerCarrosel) {
            // Renderiza em carousel (3 cards por slide)
            for (let i = 0; i < comentarios.length; i += 3) {
                let cardsHtml = '';

                for (let j = i; j < i + 3 && j < comentarios.length; j++) {
                    cardsHtml += `
                    <div class="col-md-3 item-carousel">
                        <div class="card shadow ">
                            <h3 class="text-center p-2">Comentário</h3>
                            <div class="card-body p-3">
                                <div class="h-100">
                                    <div>
                                        <p class="card-text fs-5">"${comentarios[j].descricao}"</p>
                                    </div>
                                    <div class="d-flex justify-content-around ">
                                        <div class="card-title">${gerarEstrelas(comentarios[j].nota)}</div>
                                        <h6 class="card-title">${comentarios[j].nome}</h6> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }

                const html = `
            <div class="carousel-item ${i === 0 ? 'active' : ''}" data-bs-interval="3000">
                <div class="row justify-content-around">
                    ${cardsHtml}
                </div>
            </div>`;
                layerCarrosel.insertAdjacentHTML("beforeend", html);
            }
        }
    }

    gerarComentario(comentarios);


    document.querySelector("#submit").addEventListener("click", async function (event) {
        event.preventDefault();
        try {
            
            const nome = document.querySelector("#name").value.trim();
            const nota = parseInt(document.querySelector("#rating").value);
            const descricao = document.querySelector("#review").value.trim();

            await addComentario(nome, descricao, nota);

        } catch (error) {
            alert(error)
        }
    })



})

window.addEventListener("scroll", function revealSections() {
    const aboutme = document.querySelector("#aboutMe");
    const service = document.querySelector("#services");
    const portfolio = document.querySelector("#portfolio");
    const comments = document.querySelector("#comments");
    const contact = document.querySelector("#contact");

    const sections = [aboutme, service, portfolio, comments, contact];
    const triggerBottom = window.innerHeight * 0.85; // ponto de ativação
    console.log(triggerBottom)
    sections.forEach(section => {
        if (!section) return; // evita erro se faltar alguma seção

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {
            section.classList.add("show");
        } else {
            section.classList.remove("show"); // se quiser que desapareça ao voltar
        }
    });
});
