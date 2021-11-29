export default function capitalize(str: string) {
    const split = str.split(" ")
    const capitalizedSplit = split.map(e => e[0].toUpperCase() + e.slice(1).toLowerCase())
    return capitalizedSplit.join(' ')
}