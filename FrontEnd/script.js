const gallery = document.querySelector(".gallery")

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

getWorks()




