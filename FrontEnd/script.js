//Recupération des éléments de la DOM

const gallery = document.querySelector(".gallery")
const filterAll = document.getElementById("filter-all")
const filterObjects = document.getElementById("filter-objects")
const filterAppartments = document.getElementById("filter-appartments")
const filterHostelsAndRestaurants = document.getElementById("filter-hostels-and-restaurants")
const filters = document.querySelectorAll(".filter-container li")

// Fonction d'affichage des travaux

async function getWorks(){

    let filteredWorks = []

    try{
        const apiResponse = await fetch("http://localhost:5678/api/works")

        if (!apiResponse.ok) {

            throw new Error(`Response has fail with the status ${apiResponse.status}`)

        }else{

            const works = await apiResponse.json()
            displayWorks(works)

            //On récupère le filtre sélectioner par l'utilisateur avec un addEventListener
            //Si le filtre est différent de Tous on fait appel à filter pou récupérer les éléments qui nous intérsse
            // Pour finir on fait appel à la fonction displayWorks() pour afficher le résultat

            for (let i = 0; i < filters.length; i++) {
                filters[i].addEventListener("click", () => {
                    if (filters[i].id === "filter-all") {
                        displayWorks(works)
                    }else if (filters[i].id === "filter-objects"){
                        filteredWorks = works.filter((work) => work.category.id === 1)
                        displayWorks(filteredWorks)
                    }
                    else if (filters[i].id === "filter-appartments"){
                        filteredWorks = works.filter((work) => work.category.id === 2)
                        displayWorks(filteredWorks)
                    }
                    else if (filters[i].id === "filter-hostels-and-restaurants"){
                        filteredWorks = works.filter((work) => work.category.id === 3)
                        displayWorks(filteredWorks)
                    }
                    })
                }
            }

            

        }catch(error){
        console.error('An error was encounter during the API execution : ',error)
    }
}

// Fonction d'affichage des travaux

function displayWorks(worksToDisplay){
    gallery.innerHTML = ""
    for (let i = 0; i < worksToDisplay.length; i++) {
        const figureElement = document.createElement("figure")
        const imageElement = document.createElement("img")
        imageElement.src = worksToDisplay[i].imageUrl
        imageElement.alt = worksToDisplay[i].title
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.textContent = worksToDisplay[i].title
        gallery.appendChild(figureElement)
        figureElement.appendChild(imageElement)
        figureElement.appendChild(figcaptionElement)
    }
}

// Fonction de selection des filtres

filterAll.addEventListener("click", () => {
    filterObjects.classList.remove("selected-filter")
    filterAppartments.classList.remove("selected-filter")
    filterHostelsAndRestaurants.classList.remove("selected-filter")
    filterAll.classList.add("selected-filter")
})

filterObjects.addEventListener("click", () => {
    filterAll.classList.remove("selected-filter")
    filterAppartments.classList.remove("selected-filter")
    filterHostelsAndRestaurants.classList.remove("selected-filter")
    filterObjects.classList.add("selected-filter")
})

filterAppartments.addEventListener("click", () => {
    filterAll.classList.remove("selected-filter")
    filterObjects.classList.remove("selected-filter")
    filterHostelsAndRestaurants.classList.remove("selected-filter")
    filterAppartments.classList.add("selected-filter")
})

filterHostelsAndRestaurants.addEventListener("click", () => {
    filterObjects.classList.remove("selected-filter")
    filterAppartments.classList.remove("selected-filter")
    filterAll.classList.remove("selected-filter")
    filterHostelsAndRestaurants.classList.add("selected-filter")
})

if(gallery) {
    // on verifie que gallery existe bien dans la page avant de s'en servir au sein de getWorks
    // Bonne pratique afin d'éviter de casser le site si l'élement de la DOM ou je dois afficher les éléments n'existe pas
    getWorks();
}




