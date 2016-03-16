
class LogBox {
    constructor() {
        this.ele = document.getElementById("textbox");
    }

    add_message(msg) { 
        let nel = document.createElement('p');
        nel.innerHTML = msg;
        this.ele.appendChild(nel);
        this.ele.scrollTop = this.ele.scrollHeight;
    }
}

export default LogBox;
