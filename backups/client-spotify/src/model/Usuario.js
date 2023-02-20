class Usuario {
    constructor(firstname, lastname) {
        this.firstname = firstname
        this.lastname = lastname
    }

    getName() {
        return `${this.firstname} ${this.lastname}`
    }
}