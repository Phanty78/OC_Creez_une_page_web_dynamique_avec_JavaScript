const modalLink = document.querySelector(".edition-button a")
const closeModalButton = document.querySelector(".modal-wrapper a")

modalLink.addEventListener("click",(event)=>{
    event.preventDefault()
    document.querySelector(".class-modal").classList.remove("hidden")
    document.getElementById("#modal").setAttribute("aria-hidden", false)
    document.getElementById("#modal").setAttribute("aria-modal", true)
})

closeModalButton.addEventListener("click", (event)=> {
    event.preventDefault()
    document.querySelector(".class-modal").classList.add("hidden")
    document.getElementById("#modal").setAttribute("aria-hidden", true)
    document.getElementById("#modal").removeAttribute("aria-modal")
})

