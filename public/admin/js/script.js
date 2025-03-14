// Button status 
const btnStatus = document.querySelectorAll('[button-status]');
if (btnStatus.length>0){
    let url = new URL(window.location.href);
    btnStatus.forEach(button => {
        button.addEventListener('click',()=>{
            const status = button.getAttribute('button-status');
            if (status){
                url.searchParams.set('status',status);
            } else{
                url.searchParams.delete('status');
            }
            window.location.href = url.href;
        });
    });
}

// Form Search
const formSearch = document.querySelector('#form-search');
if (formSearch){
    formSearch.addEventListener("submit",(e)=>{
        let url = new URL(window.location.href);
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword){
            url.searchParams.set('keyword',keyword);
        } else{
            url.searchParams.delete('keyword');
        }

        window.location.href = url.href;
    })
}


//Pagination
const butonPagination = document.querySelectorAll('[button-pagination]');
if (butonPagination.length>0){
    let url = new URL(window.location.href);
    butonPagination.forEach(button => {
        button.addEventListener("click",()=>{
            const page = button.getAttribute('button-pagination');
            url.searchParams.set('page',page);
            window.location.href = url.href;
        });
    });
};