var sites = document.getElementsByClassName('site');
var open = false;
for (var i = 0; i < sites.length; i++) {
    sites[i].addEventListener('click', function (e) {
        if (!open) {
            e.preventDefault();
            var target = e.target;
            if (target.nodeName != 'A') {
                target = target.parentElement;
            }

            target.classList.add('open');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', target.getAttribute('href'));
            iframe.setAttribute('id', 'frame');

            var close = document.createElement('div');
            var goto = document.createElement('a');
            var backdrop = document.getElementById('backdrop');

            goto.setAttribute('href', target.getAttribute('href'));
            goto.classList.add('goto');
            goto.setAttribute('target', '_blank');
            goto.setAttribute('title', 'Ouvrir le site dans son propre onglet');
            close.classList.add('close');
            close.setAttribute('title', 'fermer');

            function closeIt(e) {
                e.stopPropagation();
                e.preventDefault();
                document.getElementById('backdrop').classList.remove('show');
                target.classList.remove('open');
                target.removeChild(iframe);
                target.removeChild(goto);
                target.removeChild(close);
                open = false;
            }

            close.addEventListener('click', closeIt);
            backdrop.addEventListener('click', closeIt);


            target.appendChild(iframe);
            target.appendChild(goto);
            target.appendChild(close);
            backdrop.classList.add('show');
            open = true;
        }
    });

}
