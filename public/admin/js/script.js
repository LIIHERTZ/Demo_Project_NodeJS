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
        const typeChange = e.target.elements.type.value;
        if (typeChange == "delete-all"){
            const isConfirm = confirm("Bạn có chắc xóa sản phẩm?");
            if (!isConfirm){
                return;
            };
        }
        if (inputChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputChecked.forEach(input => {
                if (typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${input.value}-${position}`);
                }else{
                    ids.push(input.value);
                }
            });

            inputIds.value = ids.join(', ');
            formChangeMulti.submit();
            
        } else {
            alert("Vui lòng chọn ít nhẩt 1 sản phẩm");
        }
    });
}

//Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = document.querySelector("[close-alert]");
    setTimeout(() =>{
        showAlert.classList.add("alert-hidden");
    },time);
    closeAlert.addEventListener("click",() => {
        showAlert.classList.add("alert-hidden");
    });
}

// Upload Images
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change",(e) => {
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}