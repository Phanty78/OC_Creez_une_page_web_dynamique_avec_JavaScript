const modalLinks = document.querySelectorAll('a[href="#modal"]')
const closeModalButton = document.querySelector(".modal-wrapper a")

for (let i = 0; i < modalLinks.length; i++) {
    if (modalLinks) {
        modalLinks[i].addEventListener("click",(event)=>{
            event.preventDefault()
            document.querySelector(".class-modal").classList.remove("hidden")
            document.getElementById("#modal").setAttribute("aria-hidden", false)
            document.getElementById("#modal").setAttribute("aria-modal", true)
        })
    }
}

if (closeModalButton) {
    closeModalButton.addEventListener("click", (event)=> {
        event.preventDefault()
        document.querySelector(".class-modal").classList.add("hidden")
        document.getElementById("#modal").setAttribute("aria-hidden", true)
        document.getElementById("#modal").removeAttribute("aria-modal")
    })
    
}

