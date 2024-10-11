
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

function createRemoveBtn(hiddenfileid) {
    const removeBtn = document.createElement('button')
    removeBtn.innerText = 'X'
    removeBtn.setAttribute('id', 'btn_' + hiddenfileid)
    removeBtn.classList.add('remove-btn')
    return removeBtn
}