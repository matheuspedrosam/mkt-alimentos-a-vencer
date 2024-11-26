export default function validateProduct(product: any){
    const {name, image, validityDate, oldPrice, newPrice, category} = product;

    // Client and Retailer
    if(!name || !image || !validityDate || !oldPrice || !newPrice || !category) throw new Error('Todos os campos são obrigatórios.');

    if(category === "Categoria" || category === "Todos") throw new Error('Escolha uma categoria.');

    Object.keys(product).forEach((value) => {
        if(value === "image") return;
        if(product[value].length > 150) throw new Error('Tamanho máximo de caracteres excedido.');
    })
}