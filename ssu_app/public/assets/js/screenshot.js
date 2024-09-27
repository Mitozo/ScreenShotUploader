document.addEventListener('DOMContentLoaded', () => {
    const pasteArea = document.getElementById('pasteArea')
    foundImage = false

    pasteArea.addEventListener('paste', (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (!foundImage) {
            var clipboardElement = e.clipboardData.items
            for (item of clipboardElement) {
                if (item.kind === 'file') {
                    foundImage = true
                    var imageFile = item.getAsFile()
                    var reader = new FileReader()
                    reader.onload = function (event) {
                        event.preventDefault()
                        const imgWrapper = document.createElement('div')
                        imgWrapper.classList.add('image-wrapper')

                        var blob = new Blob([event.target.result])
                        var imageURL = URL.createObjectURL(blob)

                        const img = document.createElement('img')
                        img.src = imageURL
                        const hiddenfileid = createNewIdFileName(imageURL)

                        const filenameOnsrv = document.createElement('input')
                        filenameOnsrv.setAttribute('type', 'hidden')
                        filenameOnsrv.setAttribute('id', hiddenfileid)
                        filenameOnsrv.setAttribute('name', hiddenfileid)
                        filenameOnsrv.value = hiddenfileid
                        const removeBtn = createRemoveBtn(hiddenfileid)
                        
                        removeBtn.addEventListener('click', (e) => {
                            e.preventDefault()
                            const filenamehidden = document.getElementById(hiddenfileid)
                            removeFile(filenamehidden.value)
                            imgWrapper.remove()
                        })

                        imgWrapper.appendChild(img)
                        imgWrapper.appendChild(filenameOnsrv)
                        imgWrapper.appendChild(removeBtn)
                        pasteArea.appendChild(imgWrapper)
                        submitFileForm(event.target.result, 'paste', hiddenfileid)
                    }
                    reader.readAsArrayBuffer(imageFile)
                }
            }
        }
        setTimeout(function () {
            foundImage = false
        }, 2000)
    })
})