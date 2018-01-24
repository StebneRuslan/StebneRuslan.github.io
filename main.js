let input = document.getElementById('input');
let imageDiv = document.getElementById('imageDiv');
const image = document.getElementById('image');
imageDiv.style.width = image.offsetWidth + 'px';


function addBlock (e) {
    let imageParams = imageDiv.getBoundingClientRect();
    let div = document.createElement('DIV');
    div.textContent = input.value;

    div.setAttribute('class', 'insideTextDiv');
    let del = document.createElement('SPAN');
    del.setAttribute('class', 'del');
    del.classList.add('del-visible');
    del.addEventListener('click', remove);
    del.textContent = 'X';
    div.append(del);

    div.addEventListener('mousedown', take);

    div.addEventListener('click', addDelButton);

    imageDiv.append(div);
    let divParams = div.getBoundingClientRect();

    div.style.left = (e.x - imageParams.left - (divParams.right - divParams.left) / 2) + 'px';
    div.style.top = (e.y - imageParams.top - (divParams.bottom - divParams.top) / 2) + 'px';
    divParams = div.getBoundingClientRect();
    checkOverflow(imageParams, divParams, div);
    e.stopPropagation();
}

document.getElementById('imageDiv').addEventListener('click', addBlock);

function addDelButton(e) {
    e.target.children[0].classList.toggle('del');
    let imageParams = imageDiv.getBoundingClientRect();
    let divParams = e.target.getBoundingClientRect();

    checkOverflow(imageParams, divParams, e.target);
    divParams = e.target.getBoundingClientRect();

    if(e.target.children[0].classList.contains('del') // зменшити перевірку
        && e.target.childNodes[0] === e.target.children[0]
    ) {
        console.dir(e.target);
        e.target.style.left = parseFloat(e.target.style.left) + (imageParams.right - divParams.right) + 'px';
    }

    e.stopPropagation();
}

function remove(e) {
    e.target.parentElement.remove();
    console.dir(e.target);
    e.stopPropagation();
}

function checkOverflow(parent, child, element) { // зробити чистою
    if (parent.top > child.top) {
        element.style.top = parseFloat(element.style.top) - (child.top - parent.top) + 'px';
    } if (parent.bottom < child.bottom) {
        element.style.top = parseFloat(element.style.top) - (child.bottom - parent.bottom) + 'px';
    } if (parent.left > child.left) {
        element.style.left = parseFloat(element.style.left) - (child.left - parent.left) + 'px';
    } if (parent.right < child.right) {
        element.style.left = parseFloat(element.style.left) - (child.right - parent.right) + 'px';
        const delSpan = element.children[0];
        element.removeChild(element.children[0]);
        element.prepend(delSpan);
    } if (parent.right > child.right) {
        const delSpan = element.children[0];
        element.removeChild(element.children[0]);
        element.append(delSpan);
    }
}

function take(e) {
    let divParams = this.getBoundingClientRect();
    let centerX = e.x - divParams.left;
    let centerY = e.y - divParams.top;
    document.body.addEventListener('mousemove', (event) => {
        let imageParams = imageDiv.getBoundingClientRect();
        divParams = this.getBoundingClientRect();
        if (event.clientX + (divParams.right - divParams.left) - centerX < imageParams.right
            && event.clientX - centerX > imageParams.left) {
            this.style.left = event.x - centerX - imageParams.left + 'px';
        }
        if (event.clientY + (divParams.bottom - divParams.top) - centerY < imageParams.bottom
            && event.clientY -centerY > imageParams.top) {
            this.style.top = event.y - centerY - imageParams.top + 'px';
        }
        checkOverflow(imageParams, divParams, this);
        e.stopPropagation();
    })
}



