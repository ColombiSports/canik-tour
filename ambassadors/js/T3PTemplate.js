/**
 * Gestion basique de "modèle" HTML.
 * Retire du DOM, le template trouvé.
 */
class T3PTemplate {
	/**
	 */
	constructor({ source, mask } = null) {
		this.source = source;
		this.mask = mask;
	}

	/**
	 * Enumère l'objet passé et pour chaque entrée, recherche la clef au sein du modèle
	 * Si trouve une équivalence, remplace la clef par la valeur de l'entrée.
	 * @returns String	La source actualisée par les valeurs.
	 */
	getResult(data) {
		if (!data) return false;
		//
		var result = this.source;
		for (const [key, val] of Object.entries(data)) result = result.replaceAll(this.#unmask(key), (val || "#"));
		return result;
	}
	//

	// Le mask de remplacement des clefs
	#mask = '{{#}}';
	get mask() {
		return this.#mask;
	}
	set mask(mask) {
		if (typeof mask == 'string') this.#mask = mask;
	}
	#unmask(key) {
		return this.#mask.replace('#', key);
	}
	//

	// Retourne le String source du Template.
	get source() {
		return this.#template.innerHTML;
	}
	// Peut-être un String (Selector ou InnrerHTML) ou un ElementHTML
	set source(source) {
		if (typeof source == 'string') {
			// Si est un Selector existant
			this.#setTemplate(this.#setSelector(source));
			if (this.#template) return;

			// Si est un String source
			this.#template = document.createElement('template');
			this.#template.innerHTML = source;
		}
		// Si est un "template"
		if (source instanceof HTMLElement) {
			this.#setTemplate(source);
		}
	}

	// L'éventuel Selector utlisé pour créer la source
	get selector() {
		return this.#selector;
	}
	// Crée une source à partir d'un Selector
	set selector(selector) {
		const template = this.#setSelector(selector);
		if (template) this.#setTemplate(template);
	}

	// Test et définit le selector si valide
	#selector = '';
	#setSelector(selector) {
		try {
			// Un selector non valide jetant une exception
			const el = document.querySelector(selector);
			if (!(el instanceof HTMLElement)) return null;

			this.#selector = selector;
			return el;
		} catch (e) { }
	}

	// le template ayant été testé en amont
	#template = null;
	#setTemplate(template) {
		this.#template = template;
		// this.#template?.remove();
	}
}
