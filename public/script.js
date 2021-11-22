feltolt();

async function feltolt() {
    const valasz = await fetch("/nyilvantartas");
    const nyt = await valasz.json();
    
    let nytHTML = "";
    for (egyNyt of nyt) {
        nytHTML += '<div class="card" style="width: 240px">';
        nytHTML += `<div class="card-body"><h5 class="card-title">${egyNyt.gyarto} ${egyNyt.meret}</h5>`;
        nytHTML += `<p class="card-text">${egyNyt.megnevezes}<br>${egyNyt.osszeg}Ft</p>`;

        nytHTML += `</div></div>`;
    }
    document.getElementById('nyilvantartas').innerHTML = nytHTML;
}