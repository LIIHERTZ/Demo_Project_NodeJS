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

//Checkbox Multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click",()=>{
        if (inputCheckAll.checked){
            inputId.forEach(input => {
                input.checked = true;
            });
        } else{
            inputId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputId.forEach(input => {
        input.addEventListener("click",()=>{
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;
            if (countChecked === inputId.length){
                inputCheckAll.checked = true;
            } else{
                inputCheckAll.checked = false;
            }
        });
    });
}

//Form change multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti){
    formChangeMulti.addEventListener("submit",(e)=>{
        e.preventDefault();
        const checkboxMulti = document.querySelector('[checkbox-multi]');
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        if (inputChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputChecked.forEach(input => {
                ids.push(input.value);
            });
            inputIds.value = ids.join(', ');
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhẩt 1 sản phẩm");
        }
    });
}