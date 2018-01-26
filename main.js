let input = document.getElementById('input');
let imageDiv = document.getElementById('imageDiv');
let moved = false;

document.getElementById('imageDiv').addEventListener('click', addBlock, false);

function addBlock (e) {
    if (input.value !== '') {
        let imageParams = imageDiv.getBoundingClientRect();
        let div = document.createElement('DIV');
        div.textContent = input.value;
        div.setAttribute('class', 'insideTextDiv');
        let del = document.createElement('SPAN');
        del.setAttribute('class', 'del focus');
        del.classList.add('del-visible');
        del.addEventListener('click', remove);
        del.textContent = 'X';
        div.append(del);
        div.addEventListener('mousedown', take);
        div.addEventListener('touchstart', take);
        div.addEventListener('click', addDelButton);
        imageDiv.append(div);
        let divParams = div.getBoundingClientRect();
        div.style.left = (e.x - imageParams.left - (divParams.right - divParams.left) / 2) + 'px';
        div.style.top = (e.y - imageParams.top - (divParams.bottom - divParams.top) / 2) + 'px';
        divParams = div.getBoundingClientRect();
        checkOverflow(imageParams, divParams, div);
        input.value = '';
    } else {
        return false;
    }
}

function addDelButton(e) {
    if (!moved) {
        let del = e.target.children[0].getBoundingClientRect();
        e.target.children[0].classList.toggle('del');
        e.target.children[0].classList.remove('focus');
        let imageParams = imageDiv.getBoundingClientRect();
        let divParams = e.target.getBoundingClientRect();

        if(e.target.children[0].classList.contains('del')
            && e.target.style.flexDirection === 'row-reverse')
        {
            e.target.style.left = parseFloat(e.target.style.left) + del.width + 'px';
        }
        let allElements = document.querySelectorAll('.focus');
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('del');
        }
        e.target.children[0].classList.add('focus');
        checkOverflow(imageParams, divParams, e.target);
    }
    e.stopPropagation();
    moved = false;
}

function remove(e) {
    e.target.parentElement.remove();
    e.stopPropagation();
    moved = true;
}

function checkOverflow(parent, child, element) {
    const width = element.children[0].getBoundingClientRect().width;
    if (parent.top > child.top) {
        element.style.top = parseFloat(element.style.top) - (child.top - parent.top) + 'px';
    } if (parent.bottom < child.bottom) {
        element.style.top = parseFloat(element.style.top) - (child.bottom - parent.bottom) + 'px';
    } if (parent.left > child.left) {
        element.style.left = parseFloat(element.style.left) - (child.left - parent.left) + 'px';
    } if (parent.right < child.right + width) {
        element.style.flexDirection = 'row-reverse';
        if (!moved) {
            element.style.left = parseFloat(element.style.left) - (child.right - parent.right) + 'px';
        }
    } if (parent.right > child.right + width) {
        element.style.flexDirection = 'row';
    }
}

function take(e) {
    let divParams = e.target.getBoundingClientRect();
    let centerX;
    let centerY;
    if (e.type === 'touchstart') {
        centerX = e.targetTouches[0].clientX - divParams.left;
        centerY = e.targetTouches[0].clientY - divParams.top;
    } else {
        centerX = e.x - divParams.left;
        centerY = e.y - divParams.top;
    }

    e.target.canMove = true;

    e.target.removeEventListener('click', addDelButton);
    document.onmousemove = (event) => {
        divMove(e, event, centerX, centerY)
    };

    document.ontouchmove = (event) => {
        divMove(e, event, centerX, centerY)
    };

    e.target.addEventListener('mouseup', moveEnd, false);

    e.target.addEventListener('touchend', moveEnd, false);
}

function moveEnd(e) {
    e.target.addEventListener('click', addDelButton, false);
    e.target.canMove = false;
    if (e.type === 'touchstart') {
        moved = false;
    }
    document.ontouchmove = null;
}

function divMove(e, event, centerX, centerY) {
    if (e.target.tagName !== 'DIV') {
        return false;
    }
    if (event.type === 'touchmove') {
        event.clientX = event.targetTouches[0].clientX;
        event.clientY = event.targetTouches[0].clientY;
    }
    let divParams = e.target.getBoundingClientRect();
    let imageParams = imageDiv.getBoundingClientRect();
    if (e.target.canMove) {
        moved = true;
        if (event.clientX + (divParams.right - divParams.left) - centerX < imageParams.right
            && event.clientX - centerX > imageParams.left) {
            if(event.clientX < imageParams.right) {
                e.target.style.left = event.clientX - centerX - imageParams.left + 'px';
            }
        }
        if (event.clientY + (divParams.bottom - divParams.top) - centerY < imageParams.bottom
            && event.clientY - centerY > imageParams.top) {
            if(event.clientY < imageParams.bottom) {
                e.target.style.top = event.clientY - centerY - imageParams.top + 'px';
            }
        }
        if (event.clientX > imageParams.right) {
            e.target.style.left = imageParams.right - imageParams.left - divParams.width + 'px';
        }
        if (event.clientX < imageParams.left) {
            e.target.style.left = 0 + 'px';
        }
        if (event.clientY < imageParams.top) {
            e.target.style.top = 0 + 'px';
        }
        if (event.clientY > imageParams.bottom) {
            e.target.style.top = imageParams.bottom - divParams.height - imageParams.top + 'px';
        }
        checkOverflow(imageParams, divParams, e.target);
    }
}