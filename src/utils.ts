import IItem from "./IItem";

export function randomChar() {
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return alph[Math.floor(alph.length * Math.random())];
}

export function randomString(len: number) {
    let s = '';
    while (len > 0) {
        s += randomChar();
        len--;
    }
    return s;
}

export function randomItemsArray(): IItem[] {
    return [...Array(20)].map((_, index) => ({
        id: String(index),
        title: randomString(10)
    }))
}