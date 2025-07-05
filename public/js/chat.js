import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';
const upload = new FileUploadWithPreview('upload-images',{
    multiple: true,
    maxFileCount:6
});


// Client - Send - Message
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;
        if (content || images.length) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images : images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
        };
    });
};  
//End - Client - Send - Message


// Server - Return - Message
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".chat .inner-list-typing");
    const div = document.createElement("div");

    let htmlContent = "";
    let htmlFullName = "";
    let htmlImages = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    };

    if(data.content){
        htmlContent = `<div class="inner-content">${data.content}</div>`;
    };
    if(data.images.length > 0){
        htmlImages += `<div class="inner-images">`;
        for (const image of data.images){
            htmlImages += `<img src="${image}">`;
        };
        htmlImages += `</div>`;
    };
    div.innerHTML =`
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;
    body.insertBefore(div, boxTyping);
    const gallery = new Viewer(div);
    body.scrollTop = body.scrollHeight;
});
// End Server

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
};

//Emoji
var timeOut;
const showTyping =()=>{
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    },3000);
}

import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown');
    };
};
import textFieldEdit from 'https://cdn.jsdelivr.net/npm/text-field-edit@^4/index.js'
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    const inputData = document.querySelector('.chat .inner-form input[name="content"]');
    textFieldEdit.insert(inputData, e.detail.unicode)
    const end = inputData.value.length;
    inputData.setSelectionRange(end,end);
    inputData.focus();
    showTyping();
})


// Chat typing
const inputChat = document.querySelector('[name="content"]');
if (inputChat) {
    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
};

// Server return typing
const elementsListTyping = document.querySelector(".chat .inner-list-typing");
if(elementsListTyping){
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping ){
                const bodyChat = document.querySelector(".chat .inner-body");
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");  
                boxTyping.setAttribute("user-id",data.userId)
                boxTyping.innerHTML= `
                    <div class="inner-name">${data.fullName}</div>
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                    </div>`;
                elementsListTyping.appendChild(boxTyping); 
                bodyChat.scrollTop = bodyChat.scrollHeight;
            };
        }else{
            const boxTypingRemove = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(boxTypingRemove){
                elementsListTyping.removeChild(boxTypingRemove);
            };
        };
    });
};


// Preview-full-image
const bodyChatImage = document.querySelector(".chat .inner-body");
if(bodyChatImage){
    const gallery = new Viewer(bodyChatImage);
};