// Gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
};

// Hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
};

//Xóa yêu cầu kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("btn-refuse-friend");
            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
};


//Đồng ý yêu cầu kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");
            const userId = button.getAttribute("btn-accept-friend");
            socket.emit("CLIENT_ACCEPTED_FRIEND", userId);
        });
    });
};


//Server Return Length Accept Friend
const badgeUserAccpet = document.querySelector("[badge-users-accept]");
if (badgeUserAccpet) {
    const userId = badgeUserAccpet.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (data.userId == userId) {
            badgeUserAccpet.innerHTML = data.lengthAcceptFriend;
        };
    });
};

//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    //Trang lời mời đã nhận
    const dataUser = document.querySelector("[data-users-accept]");
    if (dataUser) {
        const userId = dataUser.getAttribute("data-users-accept");
        if (data.userId == userId) {
            //Vẽ User ra giao diện
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);
            div.innerHTML = `
                <div class="box-user">
                <div class="inner-avatar"><img src="${data.infoUserA.avatar}" alt="https://robohash.org/hicveldicta.png"></div>
                <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullName}</div>
                <div class="inner-buttons">
                <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>Chấp nhận</button>
                <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUserA._id}>Xóa</button>
                <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="btn-deleted-friend" disabled="disabled">Đã xóa</button>
                <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend="btn-accepted-friend" disabled="disabled">Đã chấp nhận</button>
                </div></div></div>
            `;
            dataUser.appendChild(div);

            //Bắt sự kiện hủy lời mời
            const buttonRefuse = div.querySelector("[btn-refuse-friend]");
            buttonRefuse.addEventListener("click", () => {
                buttonRefuse.closest(".box-user").classList.add("refuse");
                const userId = buttonRefuse.getAttribute("btn-refuse-friend");
                socket.emit("CLIENT_REFUSE_FRIEND", userId);
            });

            //Bắt sự kiện chấp nhận lời mời
            const buttonAccpet = div.querySelector("[btn-accept-friend]");
            buttonAccpet.addEventListener("click", () => {
                buttonAccpet.closest(".box-user").classList.add("accepted");
                const userId = buttonAccpet.getAttribute("btn-accept-friend");
                socket.emit("CLIENT_ACCEPTED_FRIEND", userId);
            });
        };
    };

    //Trang danh sách người dùng
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
        if (data.userId == userId) {
            const boxUserRemove = document.querySelector(`[user-id='${data.infoUserA._id}']`);
            if (boxUserRemove) {
                dataUserNotFriend.removeChild(boxUserRemove);
            };
        };  
    };
});


//SERVER_RETURN_USERID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USERID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
    if (boxUserRemove) {
        const dataUser = document.querySelector("[data-users-accept]");
        const badgeUserAccpet = document.querySelector("[badge-users-accept]");
        const userIdB = badgeUserAccpet.getAttribute("badge-users-accept");
        if (userIdB == data.userIdB) {
            dataUser.removeChild(boxUserRemove);
        }
    };
});

//SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE",(data)=>{
    //Trang danh sách bạn bè
    const dataUserFriend = document.querySelector("[data-users-friend]");
    if (dataUserFriend) {
        const boxUser = dataUserFriend.querySelector(`[user-id='${data.userId}']`);
        if (boxUser){
            boxUser.querySelector("[status]").setAttribute("status", data.status);
        };
    };
});

