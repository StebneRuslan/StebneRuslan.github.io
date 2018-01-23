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
    del.addEventListener('click', remove);
    del.textContent = 'X';
    div.append(del);

    div.addEventListener('click', addDelButton);

    // div.style.top = (e.y - imageParams.top)  + 'px';
    // div.style.left = (e.x - imageParams.left) + 'px';
    // console.log(e.x);
    //
    imageDiv.append(div);
    let divParams = div.getBoundingClientRect();

    div.style.left = (e.x - imageParams.left - (divParams.right - divParams.left) / 2) + 'px';
    div.style.top = (e.y - imageParams.top - (divParams.bottom - divParams.top) / 2) + 'px';
    divParams = div.getBoundingClientRect();
    checkOverflow(imageParams, divParams, div);
}

document.getElementById('imageDiv').addEventListener('click', addBlock);

function addDelButton(e) {
    e.target.children[0].classList.toggle('del');
    let imageParams = imageDiv.getBoundingClientRect();

    e.stopPropagation();
}

function remove(e) {
    e.target.parentElement.remove();
    console.dir(e.target);
    e.stopPropagation();
}

function checkOverflow(parent, child, element) {
    if (parent.top > child.top) {
        element.style.top = parseFloat(element.style.top) - (child.top - parent.top) + 'px';
    } if (parent.bottom < child.bottom) {
        element.style.top = parseFloat(element.style.top) - (child.bottom - parent.bottom) + 'px';
    } if (parent.left > child.left) {
        console.log('left');
        element.style.left = parseFloat(element.style.left) - (child.left - parent.left) + 'px';
    } if (parent.right < child.right) {
        element.style.left = parseFloat(element.style.left) - (child.right - parent.right) + 'px';

        const delSpan = element.children[0];
        element.removeChild(element.children[0]);
        element.prepend(delSpan);
    }

}



