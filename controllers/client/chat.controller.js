const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../sockets/client/chat.socket");
// [GET] /chat/
module.exports.index = async (req, res) => {

    //SocketIO
    chatSocket(res);
    //Tìm dữ liệu Chats
    const chats = await Chat.find({
        deleted: false
    });

    for (const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");
        
        chat.infoUser = infoUser;
    };

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Chat",
        chats : chats
    });
};
