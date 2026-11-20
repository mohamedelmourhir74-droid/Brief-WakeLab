import axios from "./node_modules/axios/dist/esm/axios.js";

const response = await axios.get(
    "http://localhost:3000/api/activites"
);




const result = response.data




console.log(result);




// -------------- inscription ----------------

const popup = document.querySelector("#ma-popup")
const formulaire = document.querySelector("#mon-formulaire")


function verifierVisibilite() {
    if (localStorage.getItem("userName") == null) {
        popup.showModal()
    } else {
        popup.close()
    }
}

verifierVisibilite()

formulaire.addEventListener("submit", event => {
    event.preventDefault()
    localStorage.setItem("userName", JSON.stringify(formulaire.fullname.value))
    verifierVisibilite()
})

console.log(localStorage.userName)







// ----------------------- Affichage -----------------------



function affichageCards(data) {
    const cardContainer = document.getElementById("books")
    cardContainer.innerHTML = ""

    data.forEach(element => {
        let card = document.createElement("div")
        card.setAttribute("class", "card col-sm-4")



        let cardBody = document.createElement("div")
        cardBody.setAttribute("class", "card-body")





        let cardHeader = document.createElement("div")
        cardHeader.setAttribute("class", "card-top d-flex justify-content-between")

        let cardTitle = document.createElement("h5")
        cardTitle.setAttribute("class", "card-title")
        cardTitle.textContent = element.titre

        let cardTheme = document.createElement("span")
        cardTheme.setAttribute("class", "theme badge text-dark")
        cardTheme.setAttribute("style", "background-color: #20c997;")
        cardTheme.textContent = element.theme

        cardHeader.appendChild(cardTitle)
        cardHeader.appendChild(cardTheme)





        let cardMid = document.createElement("div")
        cardMid.setAttribute("class", "cardMid d-flex justify-content-between")

        let cardSubtitle = document.createElement("h6")
        cardSubtitle.textContent = element.auteur

        let cardDuree = document.createElement("small")
        cardDuree.setAttribute("class", "card-duree text-secondary")
        cardDuree.textContent = `${element.duree} min`

        let dureeIcon = document.createElement("i")
        dureeIcon.setAttribute("class", "duree bi bi-calendar3")

        cardMid.appendChild(cardSubtitle)
        cardMid.appendChild(dureeIcon)
        cardMid.appendChild(cardDuree)





        let cardDescription = document.createElement("p")
        cardDescription.setAttribute("class", "card-description")
        cardDescription.textContent = element.description



        let cardAction = document.createElement("div")
        cardAction.setAttribute("class", "cardAction d-flex justify-content-between")

        let modifButton = document.createElement("button")
        modifButton.setAttribute("class", "modifier btn btn-primary rounded-3 px-4")
        modifButton.setAttribute("id", `${element.id}`)
        modifButton.setAttribute("data-bs-toggle", "modal")
        modifButton.setAttribute("data-bs-target", "#modifierActiviteModal")
        modifButton.textContent = "Modifier"

        let suppButton = document.createElement("button")
        suppButton.setAttribute("class", "supprimer btn btn-danger rounded-3 px-3")
        suppButton.setAttribute("id", `${element.id}`)
        suppButton.textContent = "Supprimer"

        cardAction.appendChild(modifButton)
        cardAction.appendChild(suppButton)





        cardBody.appendChild(cardHeader)
        cardBody.appendChild(cardMid)
        cardBody.appendChild(cardDescription)
        cardBody.appendChild(cardAction)


        card.appendChild(cardBody)

        cardContainer.appendChild(card)
    });


}
affichageCards(result)




// ----------------------- L'ajout -----------------------

let form = document.forms["formDAjout"]
form.addEventListener("submit", event => {
    event.preventDefault()

    const activite = {
        titre: form.titre.value,
        theme: form.theme.value,
        objectifs: form.objectif.value,
        duree: Number(form.duree.value),
        description: form.description.value,
        auteur: JSON.parse(localStorage.userName)
    }

    affichageCards(result)
    ajouterActivite(activite)
    form.reset()

})




async function ajouterActivite(activite) {
    const url = "http://localhost:3000/api/activites";

    try {
        const reponse = await axios.post(url, activite);


        Swal.fire({
            title: "Effectué avec succès!",
            text: `${activite.titre} a été ajouté!`,
            icon: "success"
        });


    } catch (erreur) {
        console.error("Erreur lors de l'envoi :", erreur);
    }
}



// ----------------------- Modification -----------------------

let formModification = document.forms["formModification"]

const modifButtons = document.querySelectorAll(".modifier")

modifButtons.forEach(btn => {
    btn.addEventListener("click", event => {
        let activiteAModifier = result.find(activite => activite.id == event.currentTarget.id)

        formModification.titre.value = activiteAModifier.titre
        formModification.theme.value = activiteAModifier.theme
        formModification.objectif.value = activiteAModifier.objectif
        formModification.duree.value = activiteAModifier.duree
        formModification.description.value = activiteAModifier.description



        formModification.addEventListener("submit", e => {
            e.preventDefault()
            const newdata = {
                titre: formModification.titre.value,
                theme: formModification.theme.value,
                objectifs: formModification.objectif.value,
                duree: Number(formModification.duree.value),
                description: formModification.description.value,
                auteur: localStorage.userName
            }
            updateItem(activiteAModifier.id, newdata)
            formModification.reset()
            affichageCards(result)
        })
    })
})








async function updateItem(id, updatedData) {
    try {
        const response = await axios.put(
            `http://localhost:3000/api/activites/${id}`,
            updatedData
        );


        Swal.fire({
            title: "Activité modifier avec succès!",
            icon: "success"
        });


    } catch (error) {
        console.error('Échec de la requête PUT :', error.message);
    }
}



// ----------------------- Supprimer -----------------------

const suppButtons = document.querySelectorAll(".supprimer")

suppButtons.forEach(btn => {
    btn.addEventListener("click", event => {
        const lid = event.currentTarget.id
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                supprimerUtilisateur(lid)
            }
        });


    })
})



async function supprimerUtilisateur(id) {
    try {
        const response = await axios.delete(`http://localhost:3000/api/activites/${id}`);

        Swal.fire({
            title: "Activité supprimer avec succès!",
            icon: "error"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error.response?.status || error.message);
    }
}


// ----------------------- Search & Filtrage -----------------------

//  1-Search

const search = document.getElementById("searchActivite")

search.addEventListener("keyup", event => {
    const container = document.getElementById("books")
    container.innerHTML = ""
    const activiteSible = result.filter(activite => activite.titre.toLowerCase().includes(search.value.toLowerCase()))
    affichageCards(activiteSible)
})

// 2-Filtrage

const select = document.getElementById("typeSelect")

select.addEventListener("change", event => {
    const container = document.getElementById("books")
    container.innerHTML = ""
    const activiteThemeSible = result.filter(activite => activite.theme == select.value)
    if (select.value == "Tous les thèmes") {
        affichageCards(result)
    } else {
        affichageCards(activiteThemeSible)
    }
})











