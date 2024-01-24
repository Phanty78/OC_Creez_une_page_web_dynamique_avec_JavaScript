//Recupération des éléments de la DOM
const gallery = document.querySelector(".gallery")
const filtersContainer = document.querySelector(".filter-container")
const editorModeBanner = document.querySelector(".editor-mode-banner")
const editionButton = document.querySelector(".edition-button")
const filterContainer = document.querySelector(".filter-container")
const portfolioHeader = document.querySelector(".portfolio-header")

const CategoriesURL = "http://localhost:5678/api/categories"
const worksURL = "http://localhost:5678/api/works"

// Si le token de connexion existe dans le local storage alors on le stocke dans la variable token
const token = window.localStorage.getItem("token")

async function chooseMode() { // Cette fonction définit le mode à utiliser
    
    if (token !== null) {
        editorModeBanner.classList.remove("hidden")
        editionButton.classList.remove("hidden")
        filterContainer.classList.add("hidden")
        portfolioHeader.classList.add("more-margin")
    }else{
        // On crée les boutons filter grace à un appel de l'api category
        createFiltersButton(await callDataApi(CategoriesURL))
    }
    if(gallery) {
        // on verifie que gallery existe bien dans la page avant de s'en servir au sein de getWorks
        const works = await callDataApi(worksURL)
        displayWorks(works)
        manageFilters()
    }
}

function manageFilters() { //Cette fonction affiche ou cache les travaux en fonctions du filtre sélectionné.
    let filters = document.querySelectorAll(".filter")
    const figureElements = document.querySelectorAll(".gallery figure")
    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", (event) => {
            if (event.target.id === "all-filter") {
                addOrRemoveClassSelected(event.target,filters) 
                for (let y = 0; y < figureElements.length; y++) {
                    figureElements[y].classList.remove("hidden")            
                }
            }else{
                addOrRemoveClassSelected(event.target,filters)
                for (let y = 0; y < figureElements.length; y++) {
                    figureElements[y].classList.remove("hidden") 
                    if ((figureElements[y].dataset.categoryId) !== event.target.dataset.liId) {
                        figureElements[y].classList.add("hidden") 
                    }         
                }
            }     
        })
    }
}

function displayWorks(worksToDisplay){ // Fonction d'affichage des travaux
    for (let i = 0; i < worksToDisplay.length; i++) {
        const figureElement = document.createElement("figure")
        const imageElement = document.createElement("img")
        figureElement.setAttribute("data-id", worksToDisplay[i].id);
        figureElement.setAttribute("data-category-id", worksToDisplay[i].category.id);
        imageElement.src = worksToDisplay[i].imageUrl
        imageElement.alt = worksToDisplay[i].title
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.textContent = worksToDisplay[i].title
        figureElement.appendChild(imageElement)
        figureElement.appendChild(figcaptionElement)
        gallery.appendChild(figureElement)
    }
}

function createFiltersButton(category){ // Fonction de création des bouttons filtres
    for (let i = 0; i < category.length; i++) {
        const liElement = document.createElement("li")
        liElement.classList.add("filter")
        liElement.setAttribute("data-li-id", category[i].id) 
        liElement.textContent = category[i].name
        filtersContainer.appendChild(liElement)      
    }
}

function addOrRemoveClassSelected(eventTarget,filters){ // Fonction d'ajout de la class selected et de la supression de cette même classe sur les autres filtres
    for (let i = 0; i < filters.length; i++) {
        filters[i].classList.remove("selected-filter")  
    }
    eventTarget.classList.add("selected-filter")
}

async function callDataApi(url) { // Fonction d'appel à l'API pour récupérer les categories ou les travaux
    try {
        const apiResponse = await fetch (url)
        if (!apiResponse.ok) {
            throw new Error(`Response has fail with the status ${apiResponse.status}`)      
        } else {
            return apiResponse.json()       
        }   
    } catch (error) {
        console.error('An error was encounter during the API execution : ',error) 
    } 
}
export{callDataApi}

chooseMode()








