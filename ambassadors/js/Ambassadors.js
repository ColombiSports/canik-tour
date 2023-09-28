
// Les options de scroll ////////////////////////////////////////////////////////////////////////////////////
//
const scrollOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
};
//

// Tableaux des données des Ambassadeurs remplit après lecture du JSON ///////////////////////////////////////
const ambassadors = [];
//

// Les templates T3P ////////////////////////////////////////////////////////////////////////////////////////
// A revoir car pas de condition possible
const templates = {};
//

// Map et et options //////////////////////////////////////////////////////////////////////////////////////////
const map = {
    google: null /** Référence à la Google map */,
    zoom: 6.6 /** Zoom par défaut, utilisé par Map  */,
    center: { lat: 46.5309984, lng: 1.7746257 },
    streetViewControl: false /** Retire la barre d'outil StreetView, utilisé par Map */,
    mapTypeControl: false /** Retire le type d'affichage de la map, utilisé par Map */,
    disableDefaultUI: true /** Déactive les deux précédents, utilisé par Map */,
    mapId: '8090bbfc0c536ad9' /** Le style "Map Canik" de Google Platforms, utilisé par Map */,
    icon: 'https://canik-france.com/img/MarkerCanik.png' /** Les icons, utilisé par Google.map.Marker */,
    zoomMin: 6.6,
    zoomMax: 10,
    selector: '#ambassadors_map',
    selected: null,
    //
    // Sélectionne l'Ambassadeuir dans la carte et zoom dessus ----------------------------------------------
    // Sinon définit affiche la carte en entière
    selectItem: function (ambassador) {
        this.setWindowInfo(ambassador);
        this.selected = ambassador;
    },
    // Zoom sur l'ambassadeur spécifié, si inexistant afficha la carte entière ------------------------------
    setView: function (ambassador) {
        if (ambassador) {
            this.google?.setZoom(this.zoomMax);
            this.google?.setCenter(ambassador.marker.position);
            //
        } else {
            this.google?.setCenter(this.center);
            this.google?.setZoom(this.zoomMin);
        };
    },
    // Ouvre la fenêtre des infos sur la carte --------------------------------------------------------------
    setWindowInfo: function (ambassador) {
        this.selected?.windowInfo.close();
        if (ambassador) {
            // Création d'un DocumentFragment et injection de la source personnalisé pour le client
            const template = document.createElement('template');
            template.innerHTML = templates.infoWindow.getResult(ambassador.data);

            // Création d'un élément au DOM
            const node = document.importNode(template.content, true);

            // On récupère tous les liens, pour chacun, si est vide on le supprime
            const list = node.querySelectorAll('.www > a');
            list.forEach((item) => { if (item.getAttribute('href') == "#") item.remove(); });

            // On créé un parent pour récupérer son innerHTML
            const parent = document.createElement('div');
            parent.appendChild(node);

            // Création de la fenêtre d'info
            ambassador.windowInfo = new google.maps.InfoWindow({ content: parent.innerHTML, });
            ambassador.windowInfo.open({ map: map.google, anchor: ambassador.marker });

        }

    },
    // Ajoute un marker a la carte --------------------------------------------------------------------------
    addMarker: function (ambassador) {
        const marker = new google.maps.Marker({
            position: ambassador.position,
            title: ambassador.name,
            icon: this.icon,
            map: this.google,
        });
        marker.addListener('click', (e) => markerHandler(ambassador));
        ambassador.marker = marker;
    },
};
//

// Gestionnaire de la liste des ambassadeurs sur le côté ////////////////////////////////////////////////////
const list = {
    view: 'split',
    element: null,
    selectedID: null,
    //
    // Retourne la référence au 'LI' de l'ID spécifié ------------------------------------------------------
    getButton: function (ID) {
        return document.getElementById(`BTN_${ID}`)
    },
    // Sélectionle le LI de l'ID spécifié ------------------------------------------------------------------ 
    selectItem: function (ambassador) {
        // Déselection
        let button = this.getButton(this.selectedID);
        if (button) {
            button.classList.remove('selected');
            this.selectedID = null;
        }
        // Sans ambassadeur
        if (!ambassador) return;
        //
        button = this.getButton(ambassador.ID);
        if (button) {
            button.classList.add('selected');
            this.selectedID = ambassador.ID;
        }
    },
    // Ajoute un LI de l'ambassadeur passé ------------------------------------------------------------------
    addItem: function (ambassador) {
        const li = document.createElement('li');
        this.element.appendChild(li);
        //
        li.outerHTML = templates.ambassador.getResult(ambassador.data);
        ambassador.element = li;
    },
    // Tri des éléments ------------------------------------------------------------------------------------
    sortType: 'district',
    sortFunc: {
        name: function (a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        },
        district: function (a, b) {
            if (parseInt(a.zip) > parseInt(b.zip)) return 1;
            if (parseInt(a.zip) < parseInt(b.zip)) return -1;
            return 0;
        }
    },
    sortBy: function (type) {
        // Le tri de la liste
        switch (type) {
            case 'name':
            case 'district':
                ambassadors.sort(this.sortFunc[type]);
                this.sortType = type;
                break;
        }
        // Applique le tri
        ambassadors.forEach((ambassador) => this.element.appendChild(this.getButton(ambassador.ID)));
        // Le CSS montrant le tri
        const classList = this.element.classList;
        classList.remove('sortBy_name');
        classList.remove('sortBy_district');
        classList.add(`sortBy_${type}`);
    },
    // Scroll automatique afin de faire appaitre le sélectionné -------------------------------------------
    autoScroll: function (ambassador) {
        if (this.view == 'split') this.getButton(this.selectedID)?.scrollIntoView(scrollOptions);
    }
}
//

// Au chargement de la page ////////////////////////////////////////////////////////////////////////////////
//
document.addEventListener('DOMContentLoaded', (e) => {
    // Le container UL de la liste
    list.element = document.querySelector('#ambassadors-nameList');
    //
    // On définit les modèles
    templates.ambassador = new T3PTemplate({ source: '#ambassador-template' });
    templates.infoWindow = new T3PTemplate({ source: '#windowInfo-template' });
    //
    // Ecoute du tri des ambassadeurs
    const radios = document.querySelectorAll('input[type=radio][name="ambassadors_sort"]');
    radios.forEach((radio) => radio.addEventListener('change', () => list.sortBy(radio.value)));
    //
    // Applique la classe nécessaire à la possible superposition de la carte
    onResize();
});
//

// Retaille de la page et activation du mode "étroit" ////////////////////////////////////////////////////////
// Correspond au breakpoint "phone-V" (500px) du fichier breakpoint.scss
const phoneV = 525;
//
function onResize(event) {
    list.view = (window.innerWidth < phoneV) ? 'list' : 'split';
    //
    const section = document.querySelector("#ambassadors");
    section.classList.toggle('listView', (list.view == 'list'));
}
window.addEventListener('resize', onResize);
//

// Au chargement du script Google.google /////////////////////////////////////////////////////////////////////
//
function GoogleMapInit() {
    map.google = new google.maps.Map(document.querySelector(map.selector), map);
    map.google.addListener('click', (e) => markerHandler(null));
    //
    // On lit le fichier des ambassadeurs
    fetch('./ambassadors/data/ambassadors.json')
        .then((response) => response.json())
        .then((array) => CanikMapInit(array));
}

// Initie la Map Canik vu que tous les éléments sont disponibles ////////////////////////////////////////////
//
function CanikMapInit(array) {
    array.forEach((data) => {
        // Création des objets "Ambassadeurs"
        const ambassador = new Ambassador(data);
        ambassadors.push(ambassador);
        //
        // Création des markers et le la liste
        map.addMarker(ambassador);
        list.addItem(ambassador);
    });
    list.sortBy(list.sortType);
}
//

// Handler du click sur un marker de la map /////////////////////////////////////////////////////////////////////
//
function markerHandler(ambassador) {
    map.selectItem(ambassador);
    map.setView(ambassador);
    //
    list.selectItem(ambassador);
    list.autoScroll(ambassador);
}
//

// Handler du HTML onClick des LI de la liste ///////////////////////////////////////////////////////////////////
//
function listHandler(btnID) {
    const ambassador = ambassadors.find((ambassador) => ambassador.ID == btnID.substring(4));
    list.selectItem(ambassador);
    map.selectItem(ambassador);
    map.setView(ambassador);
    //
    if (list.view == 'list') document.querySelector(map.selector).scrollIntoView(scrollOptions);
}
//

// LA CLASS OBJET ////////////////////////////////////////////////////////////////////////////////////////////////
//
class Ambassador {
    #data = null;
    marker = null;
    windowInfo = null;
    element = null;
    //
    constructor(data) {
        this.#data = data;
    }
    get ID() {
        return this.#data.id;
    }
    get data() {
        return { ...this.#data };
    }
    get name() {
        return this.#data.name;
    }
    get address() {
        return this.#data.address;
    }
    get zip() {
        return this.#data.zip;
    }
    get city() {
        return this.#data.city;
    }
    get phone() {
        return this.#data.phone;
    }
    get website() {
        return this.#data.website;
    }
    get facebook() {
        return this.#data.facebook;
    }
    get logo() {
        return this.#data.logo;
    }
    get brands() {
        return this.#data.brands;
    }
    get lat() {
        return this.#data.lat;
    }
    get lng() {
        return this.#data.lng;
    }
    get position() {
        return new google.maps.LatLng(this.lat, this.lng);
    }
}
