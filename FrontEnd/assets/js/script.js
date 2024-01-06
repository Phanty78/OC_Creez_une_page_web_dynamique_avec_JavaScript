//Recupération des éléments de la DOM

const gallery = document.querySelector(".gallery")
const filtersContainer = document.querySelector(".filter-container")
let filters = []

// Fonction d'affichage des travaux

async function getWorks(){

    let filteredWorks = []

    try{
        const apiResponse = await fetch("http://localhost:5678/api/works")

        if (!apiResponse.ok) {

            throw new Error(`Response has fail with the status ${apiResponse.status}`)

        }else{

            const works = await apiResponse.json()

            // On fait appel à la fonction callCategoryApi pour récupérer le tableau des catégories existantes
            const category = await callCategoryApi()

            //On crée un objet Set afin de compter le nombre d'élément avec un id unique présent dans l'objet category
            const categorySet = new Set(); // A remplacer par create.filterButton de category

            for (let i = 0; i < category.length; i++) {
                categorySet.add(category[i].name)
            }

            //convertion en array de l'objet Set
            const arrayCategorySet = Array.from(categorySet);

            createFiltersButton(arrayCategorySet)

            filters = document.querySelectorAll(".filter")

            // Premier appel à displayWorks pour afficher les travaux lors du première affichage de la page
            displayWorks(works)

            for (let i = 0; i < filters.length; i++) {
                filters[i].addEventListener("click", (event) => {
                    if (event.target.id === "all-filter") {
                        addOrRemoveClassSelected(event.target,filters)
                        displayWorks(works)
                    }else{
                        addOrRemoveClassSelected(event.target,filters)
                        filteredWorks = works.filter((work) => work.category.id === parseInt(event.target.dataset.liId ))
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

// Fonction d'affichage des travaux

function displayWorks(worksToDisplay){
    gallery.innerHTML = ""
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

// Fonction de création des bouttons filtres

function createFiltersButton(arrayWorksSet){
    for (let i = 0; i < arrayWorksSet.length; i++) {
        const liElement = document.createElement("li")
        liElement.classList.add("filter")
        liElement.setAttribute("data-li-id", i+1) //A remplacer par l'id venant de l'API
        liElement.textContent = arrayWorksSet[i]
        filtersContainer.appendChild(liElement)      
    }
}

// Fonction d'ajout de la class selected et de la supression de cette même classe sur les autres filtres

function addOrRemoveClassSelected(eventTarget,filters){
    for (let i = 0; i < filters.length; i++) {
        filters[i].classList.remove("selected-filter")      
    }
    eventTarget.classList.add("selected-filter")
}



if(gallery) {
    // on verifie que gallery existe bien dans la page avant de s'en servir au sein de getWorks
    // Bonne pratique afin d'éviter de casser le site si l'élement de la DOM ou je dois afficher les éléments n'existe pas
    getWorks();
}


async function callCategoryApi() {
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




