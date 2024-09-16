document.addEventListener('DOMContentLoaded', () => {
    const pasteArea = document.getElementById('pasteArea')

    pasteArea.addEventListener('paste', (e) => {
        e.stopPropagation()
        e.preventDefault()
        var clipboardElement = e.clipboardData.items
        for (item of clipboardElement) {
            if (item.kind === 'file') {
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
                    console.log("imageURL")
                    console.log(hiddenfileid)

                    const removeBtn = document.createElement('button')
                    const filenameOnsrv = document.createElement('input')
                    filenameOnsrv.setAttribute('type', 'hidden')
                    filenameOnsrv.setAttribute('id', hiddenfileid)
                    removeBtn.innerText = 'X'
                    removeBtn.setAttribute('id', 'btn_' + hiddenfileid)
                    removeBtn.classList.add('remove-btn')
                    removeBtn.addEventListener('click', (e) => {
                        e.preventDefault()
                        const filenamehidden = document.getElementById(hiddenfileid)
                        removeFile(filenamehidden.value)
                        imgWrapper.remove()
                        console.log("triggered")
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
    })
})

function createNewIdFileName(filename) {
    const indexLastSlash = filename.lastIndexOf('/')
    return filename.substring(indexLastSlash + 1)
}

function submitFileForm(file, type, hiddenfileid) {
    let formData = new FormData()
    formData.append('submission-type', type)
    let filename = document.getElementById('filename').value
    let elementDir = document.getElementById('elementDir').value
    let elementNumber = document.getElementById('elementNumber').value
    formData.append('_csrf_token', document.querySelector('[name="_csrf_token"]').value);
    formData.append('filename', filename)
    formData.append('elementDir', elementDir)
    formData.append('elementNumber', elementNumber)

    let myBlob = new Blob([file], { "type": "image/png" })
    formData.append('file', myBlob, elementDir + filename +'-file-' + elementNumber + '.png')

    let uploaderPath = document.getElementById('uploaderPath').value

    var xhr = new XMLHttpRequest()
    xhr.open('POST', uploaderPath + '/doUpload', true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onload = function () {
        msgElement = document.getElementById('msg')
        if (xhr.status == 200) {
            response = JSON.parse(xhr.responseText)
            msgElement.innerText = response.data.msg
            msgElement.classList.add(response.data.class)
            imageName = response.data.uploaded_file
            const xhiddenfileid = document.getElementById(hiddenfileid)
            xhiddenfileid.value = imageName
        } else if (xhr.status == 500) {
            msgElement.innerText = response.data.msg
            msgElement.classList.add(response.data.class)
        } else  if (xhr.status == 401) {
            msgElement.innerText = response.data.msg
            msgElement.classList.add(response.data.class)
        }
    }
    xhr.send(formData)
}

function removeFile(hiddenFilename) {
    let uploaderPath = document.getElementById('uploaderPath').value
    let formData = new FormData()
    let filename = document.getElementById('filename').value
    let elementDir = document.getElementById('elementDir').value
    formData.append('filename', filename)
    formData.append('elementDir', elementDir)
    formData.append('hiddenFilename', hiddenFilename)
    console.log("hiddenFilename")
    console.log(formData)

    var xhr = new XMLHttpRequest()
    xhr.open('POST', uploaderPath + '/removeFile', true)
    xhr.onload = function () {
        if (xhr.status == 200) {
            console.log('remove: ')
            console.log(JSON.parse(xhr.responseText))
        } else {
            console.log('Nope')
        }
    }
    xhr.send(formData)
}