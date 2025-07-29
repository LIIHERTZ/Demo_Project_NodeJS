const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    //Socket
    usersSocket(res);

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriend = myUser.requestFriend;
    const acceptFriend = myUser.acceptFriend;
    const friendList = [];
    for (const user of myUser.friendList){  
        friendList.push(user.user_id);
    };
    const users= await User.find({
        _id : {$nin: [userId, ...requestFriend, ...acceptFriend, ...friendList]},
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    res.render("client/pages/users/notFriend.pug", {
        pageTitle: "Danh sách người dùng",
        users : users
    });
};


// [GET] /users/request
module.exports.request = async (req, res) => {
    //Socket
    usersSocket(res);

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriend = myUser.requestFriend;
    const users= await User.find({
        _id : {$in: requestFriend},
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    res.render("client/pages/users/request.pug", {
        pageTitle: "Danh sách đã gửi",
        users : users
    });
};


// [GET] /users/accept
module.exports.accept = async (req, res) => {
    //Socket
    usersSocket(res);

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });

    const acceptFriend = myUser.acceptFriend;
    const users= await User.find({
        _id : {$in: acceptFriend},
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    res.render("client/pages/users/accept.pug", {
        pageTitle: "Lời mời đã nhận",
        users : users
    });
};


// [GET] /users/accept-friend
module.exports.friends = async (req, res) => {
    //Socket
    usersSocket(res);

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });

    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);
    const users= await User.find({
        _id : {$in: friendListId},
        status: "active",
        deleted: false
    }).select("id fullName avatar statusOnline");

    res.render("client/pages/users/friends.pug", {
        pageTitle: "Danh sách bạn bè",
        users : users
    });
};
