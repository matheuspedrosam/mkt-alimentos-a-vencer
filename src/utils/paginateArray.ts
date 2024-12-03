export default function paginateArray(array: Array<any>, pageSize: number = 20) {
    const pages = [];
    let currentPage = [];
  
    for (let i = 0; i < array.length; i++) {
        currentPage.push(array[i]);
    
        if (currentPage.length === pageSize || i === array.length - 1) {
            pages.push([...currentPage]);
            currentPage = [];
        }
    }
  
    return pages;
}