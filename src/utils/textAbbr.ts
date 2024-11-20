export default function textAbbr(text: string, maxLength: number){
    return text.length >= maxLength ? `${text.slice(0, maxLength)}...` : text;
}