import {callCategoryApi} from "./script.js"
import {callWorksAPI} from "./script.js"

//Récupération des éléments de la DOM pour la modal
const modalLinks = document.querySelectorAll('a[href="#modal"]')
const closeModalButtons = document.querySelectorAll(".close-modal-button")
const modalGallery = document.querySelector(".modal-gallery")
const modalWindows = document.querySelectorAll(".class-modal")
const addWorkSubmitButton = document.querySelector(".add-work-form-button")
const selectInput = document.querySelector(".select-input")
const titleInput = document.getElementById("title")
const imageLoad = document.getElementById("load-image")
const addWorkForm = document.querySelector(".add-work-form")
const addPhotoButton = document.querySelector(".add-photo-button")
const inputImage = document.getElementById("load-image")
const imagePreview = document.getElementById("image-preview")
const imageDefaultBackground = document.querySelector(".AddImageZone i")

const token = window.localStorage.getItem("token")

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
async function removeWork(trashButton, token) {
    trashButton.addEventListener("click", async event => {
        event.preventDefault();
        try {
            await deletework(event.target.dataset.workId, token);
        } catch (error) {
            console.error('An error occurred during work removal: ', error);
        }
    });
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
        if (deleteWorkAPIResponse.status !== 204) {
            throw new Error (`Response has fail with the status ${deleteWorkAPIResponse.status}`)
        }
        console.log("delete ok")
        // Il faudra ajouter le code pour masquer l'élément work supprimé sans avoir à recharger la page
    } catch (error) {
        console.error('An error was encounter during the API execution : ',error)
    }
}

// Fonction d'ouverture de la modal d'ajout de travaux et de fermeture de celle de supression des travaux
function OpenAddWorkModal(){
    closeModal(document.getElementById("modal"))
    openModal(document.getElementById("add-work-modal"))
    fillFormSelect(selectInput)
    addPhoto(addPhotoButton)
    enabledSubmitButton(addWorkSubmitButton,titleInput,selectInput,imageLoad,addWorkForm)
    ReturnToPreviousModal()
}

// Fonction d'écoute du bouton AddPhotoButton
function addPhoto(addPhotoButton) {
    addPhotoButton.addEventListener("click", addPhotoHandler)    
}

function addPhotoHandler() {
    manageImageUpload(inputImage, imagePreview, imageDefaultBackground);
}

// Fonction de reset de la div addImageZone
function ClearAddImageZone(imageElement) {
    imageElement.src = ""
    inputImage.type = "text"
    inputImage.type = "file"
    document.querySelector(".add-photo-button").classList.remove("hidden")
    document.querySelector(".AddImageZone p").classList.remove("hidden")
    document.querySelector(".AddImageZone").classList.remove("no-padding")
    imagePreview.classList.add("hidden")
    imageDefaultBackground.classList.remove("hidden")
}


//Fonction de gestion de l'ajout d'image
function manageImageUpload(inputImage,imagePreview,imageDefaultBackground) {
    inputImage.click()
    inputImage.addEventListener("change", (event) =>{
        if (inputImage.files && inputImage.files[0]) {
            if (inputImage.files[0].size <= 4000000) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                };
                reader.readAsDataURL(inputImage.files[0]);
                document.querySelector(".add-photo-button").classList.add("hidden")
                document.querySelector(".AddImageZone p").classList.add("hidden")
                document.querySelector(".AddImageZone").classList.add("no-padding")
                imagePreview.classList.remove("hidden")
                imageDefaultBackground.classList.add("hidden")
                
            } else {
                alert("Le fichier que vous tenter de télécharger dépasser la limite de 4Mo")
                ClearInputFile(inputImage)
            }
        }
        console.log("test")
    })
    
}

// Fonction de retour à la fenêtre modal précédente
function ReturnToPreviousModal() {
    const returnButton = document.querySelector(".return-button")
    returnButton.addEventListener("click", () =>{
        closeModal(document.getElementById("add-work-modal"))
        openModal(document.getElementById("modal"))
        selectInput.innerHTML = ""
        })
}

// Fonction de fermeture des modals quand l'utilisateur clique en dehors de celle ci
if (modalWindows) {
    for (let i = 0; i < modalWindows.length; i++) {
        window.addEventListener("click", (event) =>{
            if (event.target === modalWindows[i]) {
                event.preventDefault()
                closeModal(modalWindows[i])
                modalGallery.innerHTML = ""
                selectInput.innerHTML = ""
            }
        })
    }
}

// Fonction de fermeture des modals
function closeModal(modal) {
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", true)
    modal.removeAttribute("aria-modal")
    ClearAddImageZone(imagePreview)
}

// Fonction d'ouverture des modals
function openModal(modal) {
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
}


// Fonction de remplissage des categories dans la modal Ajout photo
async function fillFormSelect(selectInput) {
    const categories = await callCategoryApi()
    for (let i = 0; i < categories.length; i++) {
        const optionElement = document.createElement("option")
        optionElement.setAttribute("value", categories[i].name )
        optionElement.textContent = categories[i].name 
        selectInput.appendChild(optionElement)
    }
}

// Cette fonction vérifie que tous les chams du formulaire sont remplis à chaque changement dans le formulaire
function enabledSubmitButton(button,titleInput,selectInput,imageLoad,form) {
    form.addEventListener("change", () =>{
        if (titleInput.value !== null && titleInput.value !== "" && selectInput.value !== null && imageLoad !== null){
            button.disabled = false
        }else{
            button.disabled = true
        }
    })
}

// Gestion des événements liés au modals
if (modalLinks) {
    for (let i = 0; i < modalLinks.length; i++) {
        modalLinks[i].addEventListener("click",async (event)=>{
            const addNewWorkButton = document.querySelector(".modal-wrapper button")
            event.preventDefault()
            openModal(document.getElementById("modal"))
            const worksForModal = await callWorksAPI()
            displayWorksInGallery(worksForModal)
            const trashButtons = document.querySelectorAll("figure .trash-button")
            for (let y = 0; y < trashButtons.length; y++) {
                try {
                    await removeWork(trashButtons[y],token)
                } catch (error) {
                    console.error('An error was encounter during the API execution : ',error)
                }
            }
            addNewWorkButton.addEventListener("click", OpenAddWorkModal)
        })
    }
}

// Gestion de la demande de fermeture des modals par le bouton X
if (closeModalButtons) {
    for (let i = 0; i < closeModalButtons.length; i++) {
        closeModalButtons[i].addEventListener("click", (event)=> {
            event.preventDefault()
            const modalNodes = document.querySelectorAll(".class-modal")
            for (let y = 0; y < modalNodes.length; y++) {
                closeModal(modalNodes[y],modalGallery)
                modalGallery.innerHTML = ""
                selectInput.innerHTML = ""
            }
        })   
    }   
}


