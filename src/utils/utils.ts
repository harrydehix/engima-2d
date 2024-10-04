export function letterToNumber(letter: string) {
    return letter.charCodeAt(0) - 97;
}

export function numberToLetter(letterIndex: number){
    return String.fromCharCode(letterIndex + 97);
}