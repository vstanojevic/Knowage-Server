class HelloWorldComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this.innerHTML = `<h1 id='bojan-test'  onclick="callMe()">Hello world! ${this.http}</h1>`
    }

    static get observedAttributes() {
        return ['title', 'testHttp'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Value changed from ${oldValue} to ${newValue}`);
        this.render();
        if (this.http) this.http
    }

    get text() {
        return this.getAttribute("title");
    }

    get http() {
        console.log(">>>>>>>>>>>>>>>> HTTP: ", this.getAttribute("testHttp"))

        return this.getAttribute("testHttp");
    }
}


customElements.define("hello-world", HelloWorldComponent)

export { }