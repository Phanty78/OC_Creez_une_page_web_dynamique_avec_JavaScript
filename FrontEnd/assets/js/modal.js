import {callDataApi} from "./script.js"

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

const CategoriesURL = "http://localhost:5678/api/categories"
const worksURL = "http://localhost:5678/api/works"

const token = window.localStorage.getItem("token")

// Affichage des travaux dans la modal et construction des éléments de supression
function displayWorksInGallery(worksToDisplay){
    for (let i = 0; i < worksToDisplay.length; i++) {
        const figureElement = document.createElement("figure")
        figureElement.innerHTML = `<img src="${worksToDisplay[i].imageUrl}" alt="${worksToDisplay[i].title}"><div class="trash-button"><i class="fa-solid fa-trash-can" data-work-id="${worksToDisplay[i].id}" style="color: #ffffff;"></i></div>`
        figureElement.setAttribute("data-id", worksToDisplay[i].id)
        figureElement.setAttribute("data-category-id", worksToDisplay[i].category.id)
        modalGallery.appendChild(figureElement)
    }
}

// Fonction de gestion des evenements lors de l'appui sur le bouton de suppresion d'un work via la modale
async function removeWork(trashButton, token) {
    trashButton.addEventListener("click", async event => {
        event.preventDefault()
        event.stopPropagation()
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
        },
    }
    try {
        const deleteWorkAPIResponse = await fetch(`http://localhost:5678/api/works/${workId}`, deleteRequestOption)
        if (deleteWorkAPIResponse.status !== 204) {
            throw new Error (`Response has fail with the status ${deleteWorkAPIResponse.status}`)
        }
        // Cette partie du code permet de suprimmer l'élément de la DOM sans avoir à reload la page
        alert(`La réalisation numéro ${workId} a bien était supprimé.`)
        const removedElements = document.querySelectorAll(`[data-id="${workId}"]`)
        for (let i = 0; i < removedElements.length; i++) {
            removedElements[i].classList.add("hidden")
            removedElements[i].remove()
        }
    } catch (error) {
        console.error('An error was encounter during the API execution : ',error)
    }
}

// Fonction d'envoie d'un nouveau work 
async function addWork(tokenBearer) {
    const formData = new FormData();
    formData.append("image", inputImage.files[0]);
    formData.append("title",String(titleInput.value));
    formData.append("category",selectInput.value );

    const postRequestOption = {
        method : 'POST',
        headers : {
            'Authorization' : `Bearer ${tokenBearer}`,
            'accept': 'application/json',
        },
        body: formData,
    }
    try {
        const addWorkkAPIResponse = await fetch("http://localhost:5678/api/works", postRequestOption)
        if (addWorkkAPIResponse.status !== 201) {
            if (addWorkkAPIResponse.status === 400) {
                alert("Erreur, requête erroné")
            } else if (addWorkkAPIResponse.status === 401){
                alert("Erreur, vous n'êtes pas autorisée à faire cette requête, rapprochez-vous d'un administrateur")
            }else{
                alert("Erreur, une erreur inattendue, c'est produite")
            }
            throw new Error (`Response has fail with the status ${addWorkkAPIResponse.status}`)
        }
        return addWorkkAPIResponse.json() 
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
    addWorkFormSubmit(addWorkForm)
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
        event.stopPropagation()
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
    })
    
}

// Fonction de retour à la fenêtre modal précédente
function ReturnToPreviousModal() {
    const returnButton = document.querySelector(".return-button")
    returnButton.addEventListener("click", (event) =>{
        event.stopPropagation()
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
                event.stopPropagation()
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
    const categories = await callDataApi(CategoriesURL)
    for (let i = 0; i < categories.length; i++) {
        const optionElement = document.createElement("option")
        optionElement.setAttribute("value", categories[i].id )
        optionElement.textContent = categories[i].name 
        selectInput.appendChild(optionElement)
    }
}

// Cette fonction vérifie que tous les chams du formulaire sont remplis à chaque changement dans le formulaire
function enabledSubmitButton(button,titleInput,selectInput,imageLoad,form) {
    form.addEventListener("change", (event) =>{
        event.stopPropagation()
        if (titleInput.value !== null && titleInput.value !== "" && selectInput.value !== null && imageLoad.value !== null){
            button.disabled = false
        }else{
            button.disabled = true
        }
    })
}

// Fonction d'écoute du bouton addWorkSubmitButton et d'appel API POST d'un nouveau work
function addWorkFormSubmit(addWorkForm) {
    addWorkForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (inputImage.files[0] !== null && titleInput.value !== "" && selectInput.value !== "") {
            await addWork(token)
        }
    })
}


// Gestion des événements liés au modals
if (modalLinks) {
    for (let i = 0; i < modalLinks.length; i++) {
        modalLinks[i].addEventListener("click",async (event)=>{
            const addNewWorkButton = document.querySelector(".modal-wrapper button")
            event.preventDefault()
            event.stopPropagation()
            openModal(document.getElementById("modal"))
            const worksForModal = await callDataApi(worksURL)
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
            event.stopPropagation()
            const modalNodes = document.querySelectorAll(".class-modal")
            for (let y = 0; y < modalNodes.length; y++) {
                closeModal(modalNodes[y],modalGallery)
                modalGallery.innerHTML = ""
                selectInput.innerHTML = ""
            }
        })   
    }   
}