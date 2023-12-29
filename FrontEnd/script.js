//Recupération des éléments de la DOM

const gallery = document.querySelector(".gallery")
const filterAll = document.getElementById("filter-all")
const filterObjects = document.getElementById("filter-objects")
const filterAppartments = document.getElementById("filter-appartments")
const filterHostelsAndRestaurants = document.getElementById("filter-hostels-and-restaurants")
const filters = document.querySelectorAll(".filter-container li")

// Fonction d'affichage des travaux

async function getWorks(){

    try{
        const apiResponse = await fetch("http://localhost:5678/api/works")

        if (!apiResponse.ok) {

            throw new Error(`Response has fail with the status ${apiResponse.status}`)

        }else{

            const works = await apiResponse.json()
            for (let i = 0; i < works.length; i++) {
                const figureElement = document.createElement("figure")
                const imageElement = document.createElement("img")
                imageElement.src = works[i].imageUrl
                imageElement.alt = works[i].title
                const figcaptionElement = document.createElement("figcaption")
                figcaptionElement.textContent = works[i].title
                gallery.appendChild(figureElement)
                figureElement.appendChild(imageElement)
                figureElement.appendChild(figcaptionElement)
            }
        }
        
    }catch(error){
        console.error('An error was encounter during the API execution : ',error)
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

// Function de détection du click sur un des boutons filtre
for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", () => {
        console.log(filters[i])
    })
}



getWorks()




