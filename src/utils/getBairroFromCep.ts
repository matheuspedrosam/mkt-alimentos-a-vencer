export default async function getBairroFromCEP (cep: string) {
    const url = `https://viacep.com.br/ws/${cep}/json/`; // URL da API ViaCEP
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.erro) {
            console.error("CEP inválido");
            return null;
        }

        return data.bairro; // Retorna o bairro
    } catch (error) {
        console.error("Erro ao buscar CEP", error);
        return null;
    }
};