//list of images
// const list = 
document.addEventListener('DOMContentLoaded', () => {
  msgElement = document.getElementById('msg')
  document.querySelectorAll('.img-thumbnail').forEach(elem => {
    const parent = elem.closest('.shadow-sm')
    let elementName = elem.getAttribute('alt')
    const remBtn = createRemoveBtn(elementName)
    parent.appendChild(remBtn)
    remBtn.addEventListener('click', (e) => {
      e.preventDefault()
      removeFile(elementName)
      parent.remove()
    })
    // console.log(elem.getAttribute('alt'))
  })
})    