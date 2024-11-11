export default function textAbbr(text: string, maxLength: number){
    return `${text.slice(0, maxLength)}...`;
}