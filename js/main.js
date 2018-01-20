var localdata = [];
var loading = false;
var start = true;

//Check to see if there are existing images
if (window.localStorage.moodboard) {
    loading = true;
    localdata = JSON.parse(window.localStorage.moodboard);
    for (var i = 0; i < localdata.length; i++) {
        addImage(localdata[i].url, localdata[i].x, localdata[i].y, i, localdata[i].style, localdata[i].gray);
    }
    loading = false;
}

function updateData() {
    window.localStorage.moodboard = JSON.stringify(localdata);
}

function updateThis(el) {
    localdata[el.id].x = el.getAttribute('data-x');
    localdata[el.id].y = el.getAttribute('data-y');
    localdata[el.id].style = el.getAttribute('style');
    updateData();
}

// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: false,
            elementRect: {
                top: 0,
                left: 0,
                bottom: 1,
                right: 1
            }
        },
        // enable autoScroll
        autoScroll: false,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        onend: function (event) {
            updateThis(event.target);
        }
    })
    .resizable({
        // resize from all edges and corners
        edges: {
            left: true,
            right: true,
            bottom: true,
            top: true
        },

        // keep the edges inside the parent
        restrictEdges: {
            outer: 'parent',
            endOnly: true,
        },

        // minimum size
        restrictSize: {
            min: {
                width: 100,
                height: 50
            },
        },

        inertia: true,
        preserveAspectRatio: true,
        onend: function (event) {
            updateThis(event.target);
        }
    })
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    });



function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function addImage(src, x = 50, y = 100, id = localdata.length, style = false, gray = false) {
    var div = document.createElement('div');
    var img = document.createElement('img');
    var close = document.createElement('span');
    var up = document.createElement('span');
    var down = document.createElement('span');
    var bw = document.createElement('span');

    close.innerHTML = '+';
    up.innerHTML = '🡹';
    down.innerHTML = '🡻';
    bw.innerHTML = '☯'

    img.src = src;
    div.classList.add('draggable', 'just_added');
    div.id = id;
    if (style) {
        div.style = style;
    }
    if (gray) {
        div.classList.add('grayscale');
    }

    close.classList.add('close', 'controls');
    up.classList.add('up', 'controls');
    down.classList.add('down', 'controls');
    bw.classList.add('bw', 'controls');

    div.append(img);
    div.append(close);
    div.append(up);
    div.append(down);
    div.append(bw);
    document.body.append(div);

    div.setAttribute("data-x", x);
    div.setAttribute("data-y", y);
    div.style.transform = "translate(" + x + "px, " + y + "px)";

    close.addEventListener('click', function () {
        for (var i = parseInt(div.id) + 1; i < localdata.length; i++) {
            var newid = localdata[i].id -= 1;
            document.getElementById(i).id = newid;
        }
        localdata.splice(div.id, 1);
        document.body.removeChild(div);
        updateData();

        //add info text if no more images.
        if (localdata.length == 0) {
            start = true;
            document.getElementById('start_info').classList.remove('hidden');
        }
    });
    up.addEventListener('click', function () {
        div.style.zIndex++;
        updateThis(div);
    });
    down.addEventListener('click', function () {
        if (div.style.zIndex == 0) {
            var divs = document.getElementsByClassName('draggable');
            for (var i = 0; i < divs.length; i++) {
                divs[i].style.zIndex++;
            }
        }
        div.style.zIndex--;
        updateThis(div);
    });
    bw.addEventListener('click', function () {
        div.classList.toggle('grayscale');
        localdata[div.id].gray = !localdata[div.id].gray;
        updateData();
    });

    if (!loading) {
        localdata.push({
            url: src,
            x: x,
            y: y,
            zindex: localdata.length,
            id: id
        });
        updateData();
    }

    if (start) {
        start = false;
        document.getElementById('start_info').classList.add('hidden');
    }
}

//Drop external images
function allowDrop(ev) {
    ev.preventDefault();
}

//Drop local images
function dropLocal(evt, x, y) {
    var files = evt.dataTransfer.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                addImage(e.target.result, x, y);
                x += 20;
                y += 20;
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function drop(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var x = ev.clientX - 50;
    var y = ev.clientY - 50;
    for (var i = 0; i < ev.dataTransfer.types.length; i++) {
        if (ev.dataTransfer.types[i] == 'text/html') {
            var imageUrl = ev.dataTransfer.getData('text/html');
            
            //fix pinterest image size
            imageUrl = imageUrl.replace(/pinimg.com\/236x/, "pinimg.com/564x")
            
            var rex = / src="?([^"\s]+)"?\s*/;
            var url, res;
            url = rex.exec(imageUrl);
            addImage(url[1], x, y);
            return;
        } else if (ev.dataTransfer.types[i] == 'Files') {
            dropLocal(ev, x, y);
            return;
        }
    }
    alert('Sorry, unrecognized image type!');


}

//Add image button
function addButton(e) {
    e.preventDefault();
    var url = document.getElementById("img_url").value;
    document.getElementById("img_url").value = '';
    if (url != '' && url.length > 5) {
        addImage(url);
    }
    toggleForm();
    document.getElementById("img_url").blur();
}

function toggleForm() {
    document.getElementById('form').classList.toggle('hidden');
    document.getElementById('img_url').focus();
}

window.dragMoveListener = dragMoveListener;

document.getElementById('add').addEventListener('click', toggleForm);
