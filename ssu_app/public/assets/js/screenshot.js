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

                        const removeBtn = document.createElement('button')
                        const filenameOnsrv = document.createElement('input')
                        filenameOnsrv.setAttribute('type', 'hidden')
                        filenameOnsrv.setAttribute('id', hiddenfileid)
                        filenameOnsrv.setAttribute('name', hiddenfileid)
                        filenameOnsrv.value = hiddenfileid
                        removeBtn.innerText = 'X'
                        removeBtn.setAttribute('id', 'btn_' + hiddenfileid)
                        removeBtn.classList.add('remove-btn')
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

function createNewIdFileName(filename) {
    const indexLastSlash = filename.lastIndexOf('/')
    return filename.substring(indexLastSlash + 1)
}

function submitFileForm(file, type, hiddenfileid) {
    let formData = new FormData()
    formData.append('submission-type', type)
    let filename = hiddenfileid
    formData.append('_csrf_token', document.querySelector('[name="_csrf_token"]').value);
    formData.append('filename', filename)

    let myBlob = new Blob([file], { "type": "image/png" })
    formData.append('file', myBlob, filename + '.png')

    let uploaderPath = document.getElementById('uploaderPath').value

    var xhr = new XMLHttpRequest()
    xhr.open('POST', uploaderPath + '/doUpload', true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onload = function () {
        msgElement = document.getElementById('msg')
        response = JSON.parse(xhr.responseText)
        if (xhr.status == 200) {
            displayResponse(msgElement, response.data.msg, response.data.class)
        } else if (xhr.status == 500) {
            displayResponse(msgElement, response.data.msg, response.data.class)
        } else if (xhr.status == 401) {
            displayResponse(msgElement, response.data.msg, response.data.class)
        }
    }
    xhr.send(formData)
}

function removeFile(hiddenFilename) {
    let uploaderPath = document.getElementById('uploaderPath').value
    let formData = new FormData()
    formData.append('filename', hiddenFilename)
    
    var xhr = new XMLHttpRequest()
    xhr.open('POST', uploaderPath + '/removeFile', true)
    xhr.onload = function () {
        msgElement = document.getElementById('msg')
        response = JSON.parse(xhr.responseText)
        if (xhr.status == 200) {
            displayResponse(msgElement, response.data.msg, response.data.class)
        } else {
            displayResponse(msgElement, response.data.msg, response.data.class)
        }
    }
    xhr.send(formData)
}

function displayResponse(elm, m, c) {
    elm.innerText = m
    elm.classList.add(c)
}