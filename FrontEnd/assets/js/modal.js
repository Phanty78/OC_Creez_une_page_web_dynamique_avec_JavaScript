import {callDataApi} from "./script.js"

//Récupération des éléments de la DOM pour la modal
const modalLinks = document.querySelectorAll('a[href="#modal"]')
const closeModalButtons = document.querySelectorAll(".close-modal-button")
const modalGallery = document.querySelector(".modal-gallery")
const modalWindows = document.querySelectorAll(".class-modal")
const addWorkSubmitButton = document.querySelector(".add-work-form-button")
const selectInput = document.querySelector(".select-input")
const titleInput = document.getElementById("title")
const addWorkForm = document.querySelector(".add-work-form")
const addPhotoButton = document.querySelector(".add-photo-button")
const inputImage = document.getElementById("load-image")
const imagePreview = document.getElementById("image-preview")
const imageDefaultBackground = document.querySelector(".AddImageZone i")
const gallery = document.querySelector(".gallery")
const modalMessage = document.querySelector(".modal-message")
const inputsArray = document.querySelectorAll(".add-work-form input")

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
function removeWork(trashButton, token) {
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
            if (deleteWorkAPIResponse.status === 401) {
                alert("Erreur, vous n'êtes pas autorisée à faire cette requête, rapprochez-vous d'un administrateur")
            }
            if (deleteWorkAPIResponse.status === 500) {
                alert("Erreur, une erreur inattendue, c'est produite")
            }
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

// Fonction d'affichage du message dans la modale pour informer l'utilisateur
function displayModalMessage(message) {
    modalMessage.textContent = message
    modalMessage.classList.remove("hidden")
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
        const addWorkAPIResponse = await fetch("http://localhost:5678/api/works", postRequestOption)
        if (addWorkAPIResponse.status !== 201) {
            if (addWorkAPIResponse.status === 400) {
                displayModalMessage("Erreur, requête erroné")
            } else if (addWorkAPIResponse.status === 401){
                displayModalMessage("Erreur, vous n'êtes pas autorisée à faire cette requête, rapprochez-vous d'un administrateur")
            }else{
                displayModalMessage("Erreur, une erreur inattendue, c'est produite")
            }
            throw new Error (`Response has fail with the status ${addWorkAPIResponse.status}`)
        }
        const newWork =  []
        newWork.push(await addWorkAPIResponse.json())
        addNewWorkInGallery(newWork)
        addNewWorkInModalGallery(newWork)
        displayModalMessage("La nouvelle entrée est bien enregistré")
        addWorkForm.reset()
        document.querySelector(".add-photo-button").classList.remove("hidden")
        document.querySelector(".AddImageZone p").classList.remove("hidden")
        document.querySelector(".AddImageZone").classList.remove("no-padding")
        imagePreview.classList.add("hidden")
        imageDefaultBackground.classList.remove("hidden")
    } catch (error) {
        console.error('An error was encounter during the API execution : ',error)
    }
}

function addNewWorkInGallery(work){ // Fonction d'ajout dynamique du travai ajouté dans la gallerie principale
    for (let i = 0; i < work.length; i++) {
        const figureElement = document.createElement("figure")
        const imageElement = document.createElement("img")
        figureElement.setAttribute("data-id", work[i].id);
        figureElement.setAttribute("data-category-id", work[i].categoryId);
        imageElement.src = work[i].imageUrl
        imageElement.alt = work[i].title
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.textContent = work[i].title
        figureElement.appendChild(imageElement)
        figureElement.appendChild(figcaptionElement)
        gallery.appendChild(figureElement)
    }
}

function addNewWorkInModalGallery(work){ // Fonction d'ajout dynamique du travai ajouté dans la gallerie de la modale de supression des éléments
    for (let i = 0; i < work.length; i++) {
        const figureElement = document.createElement("figure")
        figureElement.innerHTML = `<img src="${work[i].imageUrl}" alt="${work[i].title}"><div class="trash-button"><i class="fa-solid fa-trash-can" data-work-id="${work[i].id}" style="color: #ffffff;"></i></div>`
        figureElement.setAttribute("data-id", work[i].id)
        figureElement.setAttribute("data-category-id", work[i].categoryId)
        modalGallery.appendChild(figureElement)
    }
}


function OpenAddWorkModal(){ // Fonction d'ouverture de la modal d'ajout de travaux et de fermeture de celle de supression des travaux
    closeModal(document.getElementById("modal"))
    openModal(document.getElementById("add-work-modal"))
    fillFormSelect(selectInput)
    addPhoto(addPhotoButton)
    enabledSubmitButton(addWorkSubmitButton,titleInput,selectInput,inputImage,addWorkForm)
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

function closeModal(modal) { // Fonction de fermeture des modals
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", true)
    modal.removeAttribute("aria-modal")
    ClearAddImageZone(imagePreview)
    modalMessage.textContent = ""
    modalMessage.classList.add("hidden")
}

function openModal(modal) { // Fonction d'ouverture des modals
    modal.classList.remove("hidden")
    modal.setAttribute("aria-hidden", false)
    modal.setAttribute("aria-modal", true)
}



async function fillFormSelect(selectInput) { // Fonction de remplissage des categories dans la modal Ajout photo
    const categories = await callDataApi(CategoriesURL)
    for (let i = 0; i < categories.length; i++) {
        const optionElement = document.createElement("option")
        optionElement.setAttribute("value", categories[i].id )
        optionElement.textContent = categories[i].name 
        selectInput.appendChild(optionElement)
    }
}

// Cette fonction vérifie que tous les champs du formulaire sont remplis à chaque changement dans le formulaire
function enabledSubmitButton(button,titleInput,selectInput,inputImage,form) {
    form.addEventListener("input", (event) =>{
        event.stopPropagation()
        if (titleInput.value !== null && titleInput.value !== "" && selectInput.value !== null && inputImage.files.length > 0){
            button.disabled = false
        }else{
            button.disabled = true
        }
    })
}

function addWorkFormSubmit(addWorkForm) { // Fonction d'écoute du bouton addWorkSubmitButton et d'appel API POST d'un nouveau work
    addWorkForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (inputImage.files.length > 0 && titleInput.value !== "" && selectInput.value !== "") {
            addWorkSubmitButton.disabled = true;
            try {
                await addWork(token)
                addWorkSubmitButton.disabled = false;
            } catch (error) {
                console.error('An error occurred during work submission: ', error);
                addWorkSubmitButton.disabled = false;
            }
            
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

for (let i = 0; i < inputsArray.length; i++) {
    inputsArray[i].addEventListener("focus",(event) =>{
        if (modalMessage) {
            modalMessage.textContent = ""
            modalMessage.classList.add("hidden")
        }      
    })
}