//Récupération des éléments de la DOM pour la modal
const modalLinks = document.querySelectorAll('a[href="#modal"]')
const closeModalButtons = document.querySelectorAll(".close-modal-button")
const modalGallery = document.querySelector(".modal-gallery")
const modalWindows = document.querySelectorAll(".class-modal")

// Appel a l'API pour l'affichage des travaux dans la modal
async function getWorksForModal(){
    try {
        const APIResponse = await fetch("http://localhost:5678/api/works")
        if (!APIResponse.ok) {
            throw new Error (`Response has fail with the status ${apiResponse.status}`)
        }else{
            return (await APIResponse).json()
        }
    } catch (error) {
        alert("La connexion a l'API a échoué pour le chargement de la modal.")
        console.error('An error was encounter during the API execution : ',error)
    }
}

// Affichage des travaux dans la modal et construction des éléments de supression
function displayWorksInGallery(worksToDisplay){
    for (let i = 0; i < worksToDisplay.length; i++) {
        const figureElement = document.createElement("figure")
        figureElement.innerHTML = `<img src="${worksToDisplay[i].imageUrl}" alt="${worksToDisplay[i].title}"><div class="trash-button"><i class="fa-solid fa-trash-can" data-work-id="${worksToDisplay[i].id}" style="color: #ffffff;"></i></div>`
        figureElement.setAttribute("data-category-id", worksToDisplay[i].category.id);
        modalGallery.appendChild(figureElement)
    }
}

// Fonction de gestion des evenements lors de l'appui sur le bouton de suppresion d'un work via la modale
async function removeWork(trashButton,token) {
    trashButton.addEventListener("click", async event => {
    event.preventDefault()
    deletework(event.target.dataset.workId,token)
    } )
}

// Fonction de suppresion d'un work, renvoie une erreur pour le moment
async function deletework(workId,tokenBearer) {
    const deleteRequestOption = {
        method : 'DELETE',
        headers : {
            'Authorization' : `Bearer ${tokenBearer}`,
            'Content-Type':'application/json',
        }
    }
    try {
        const deleteWorkAPIResponse = await fetch(`http://localhost:5678/api/works/${workId}`, deleteRequestOption)
        if (!deleteWorkAPIResponse.ok) {
            throw new Error (`Response has fail with the status ${apiResponse.status}`)
        }
        const deletedWorkData = await deleteWorkAPIResponse.json()
        console.log("delete ok")
        return deletedWorkData
        // Il faudra ajouter le code pour masquet l'élément work supprimé sans avoir à recharger la page
    } catch (error) {
        alert("Une erreur est survenu durant la tentative de supression.")
        console.error('An error was encounter during the API execution : ',error)
    }
}

// Fonction d'ouverture de la modal d'ajout de travaux et de fermeture de celle de supression des travaux
function OpenAddWorkModal(){
    closeModal(document.getElementById("modal"))
    openModal(document.getElementById("add-work-modal"))
    ReturnToPreviousModal()
}

// Fonction de retour à la fenêtre modal précédente
function ReturnToPreviousModal() {
    const returnButton = document.querySelector(".return-button")
    returnButton.addEventListener("click", (event) =>{
        closeModal(document.getElementById("add-work-modal"))
        openModal(document.getElementById("modal"))
        })
}

if (modalLinks) {
    for (let i = 0; i < modalLinks.length; i++) {
        modalLinks[i].addEventListener("click",async (event)=>{
            const addNewWorkButton = document.querySelector(".modal-wrapper button")
            event.preventDefault()
            openModal(document.getElementById("modal"))
            const worksForModal = await getWorksForModal()
            displayWorksInGallery(worksForModal)
            const trashButtons = document.querySelectorAll("figure .trash-button")
            for (let i = 0; i < trashButtons.length; i++) {
                removeWork(trashButtons[i],token)
            }
            addNewWorkButton.addEventListener("click", (event)=>{
            OpenAddWorkModal()
            })
            
        })
}
}

// Fonction de fermetue des modals par le bouton X
if (closeModalButtons) {
    for (let i = 0; i < closeModalButtons.length; i++) {
        closeModalButtons[i].addEventListener("click", (event)=> {
            event.preventDefault()
            const modalNodes = document.querySelectorAll(".class-modal")
            for (let i = 0; i < modalNodes.length; i++) {
                closeModal(modalNodes[i],modalGallery)
                modalGallery.innerHTML = ""
            }
        })   
    }   
}

// Fonction de fermeture des modals quand l'utilisateur clique en dehors de celle ci
if (modalWindows) {
    for (let i = 0; i < modalWindows.length; i++) {
        window.addEventListener("click", (event) =>{
            if (event.target === modalWindows[i]) {
                event.preventDefault()
                closeModal(modalWindows[i])
                modalGallery.innerHTML = ""
            }
        })
    }
}

// Fonction de fermeture des modals
function closeModal(modal) {
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", true)
    modal.removeAttribute("aria-modal")   
}

// Fonction d'ouverture des modals
function openModal(modal) {
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
}
