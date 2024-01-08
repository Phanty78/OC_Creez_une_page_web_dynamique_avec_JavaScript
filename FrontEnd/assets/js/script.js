
//Recupération des éléments de la DOM

const gallery = document.querySelector(".gallery")
const filtersContainer = document.querySelector(".filter-container")
const editorModeBanner = document.querySelector(".editor-mode-banner")
const editionButton = document.querySelector(".edition-button")
const filterContainer = document.querySelector(".filter-container")
const portfolioHeader = document.querySelector(".portfolio-header")
let filters = []

// Si le token de connexion existe dans le local storage alors on le stocke dans la variable token

const token = window.localStorage.getItem("token")

async function chooseMode() { // Cette fonction définit le mode à utiliser
    
    if (token !== null) {
    
        editorModeBanner.classList.remove("hidden")
        editionButton.classList.remove("hidden")
        filterContainer.classList.add("hidden")
        portfolioHeader.classList.add("more-margin")
        getWorks()
        
    }else{

        // On crée les boutons filter grace à un appel de l'api category
        createFiltersButton(await callCategoryApi())
    
        if(gallery) {
            // on verifie que gallery existe bien dans la page avant de s'en servir au sein de getWorks
            // Bonne pratique afin d'éviter de casser le site si l'élement de la DOM ou je dois afficher les éléments n'existe pas
            getWorks()
        }
    }
}

async function getWorks(){ // Fonction de récupération et d'appel d'affichage des travaux 

    let filteredWorks = []

    try{
        const apiResponse = await fetch("http://localhost:5678/api/works")

        if (!apiResponse.ok) {

            throw new Error(`Response has fail with the status ${apiResponse.status}`)

        }else{

            const works = await apiResponse.json()

            filters = document.querySelectorAll(".filter")

            // Premier appel à displayWorks pour afficher les travaux lors du première affichage de la page
            displayWorks(works)

            for (let i = 0; i < filters.length; i++) {
                filters[i].addEventListener("click", (event) => {
                    if (event.target.id === "all-filter") {
                        addOrRemoveClassSelected(event.target,filters)
                        gallery.innerHTML = ""
                        displayWorks(works)
                    }else{
                        addOrRemoveClassSelected(event.target,filters)
                        filteredWorks = works.filter((work) => work.category.id === parseInt(event.target.dataset.liId ))
                        gallery.innerHTML = ""
                        displayWorks(filteredWorks)
                    }
                    
                })
            }

            }

        }catch(error){
            alert("La connexion a échoué.")
            console.error('An error was encounter during the API execution : ',error)
    }
}

/*
async function getWorks(){ // Fonction d'affichage des travaux

    let filteredWorks = []

    try{
        const apiResponse = await fetch("http://localhost:5678/api/works")

        if (!apiResponse.ok) {

            throw new Error(`Response has fail with the status ${apiResponse.status}`)

        }else{

            const works = await apiResponse.json()

            // On fait appel à la fonction callCategoryApi pour récupérer le tableau des catégories existantes
            const category = await callCategoryApi()

            createFiltersButton(category)

            filters = document.querySelectorAll(".filter")

            // Premier appel à displayWorks pour afficher les travaux lors du première affichage de la page
            displayWorks(works)

            for (let i = 0; i < filters.length; i++) {
                filters[i].addEventListener("click", (event) => {
                    if (event.target.id === "all-filter") {
                        addOrRemoveClassSelected(event.target,filters)
                        gallery.innerHTML = ""
                        displayWorks(works)
                    }else{
                        addOrRemoveClassSelected(event.target,filters)
                        filteredWorks = works.filter((work) => work.category.id === parseInt(event.target.dataset.liId ))
                        gallery.innerHTML = ""
                        displayWorks(filteredWorks)
                    }
                    
                })
            }

            }

        }catch(error){
            alert("La connexion a échoué.")
            console.error('An error was encounter during the API execution : ',error)
    }
}*/

function createCategorySet(category){
    //On crée un objet Set afin de compter le nombre d'élément avec un id unique présent dans l'objet category
    const categorySet = new Set(); // A remplacer par create.filterButton de category
    for (let i = 0; i < category.length; i++) {
        categorySet.add(category[i].name)
    }
    //convertion en array de l'objet Set
    return Array.from(categorySet);
}



function displayWorks(worksToDisplay){ // Fonction d'affichage des travaux
    for (let i = 0; i < worksToDisplay.length; i++) {
        const figureElement = document.createElement("figure")
        const imageElement = document.createElement("img")
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


async function callCategoryApi() { // Fonction d'appel à l'API pour récupérer les categories
    try {

        const apiCategoryResponse = await fetch ("http://localhost:5678/api/categories")
    
        if (!apiCategoryResponse.ok) {
    
            throw new Error(`Response has fail with the status ${apiCategoryResponse.status}`)
            
        } else {
    
            return apiCategoryResponse.json()
            
        }
        
    } catch (error) {
    
        console.error('An error was encounter during the API execution : ',error)
    
    }
    
}

chooseMode()






