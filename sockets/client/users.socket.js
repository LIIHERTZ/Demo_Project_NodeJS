const User = require("../../models/user.model");
module.exports = async (res)=>{
    _io.once('connection', (socket) => {
        //Lắng nghe Gửi yêu cầu
        socket.on("CLIENT_ADD_FRIEND", async (userId)=>{
            const myUserId = res.locals.user.id;
            const existUserAinB = await User.findOne({
                _id : userId,
                acceptFriend: myUserId
            });

            if(!existUserAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {acceptFriend:myUserId}
                });
            }
            const existUserBinA = await User.findOne({
                _id : myUserId,
                requestFriend: userId
            });

            if(!existUserBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {requestFriend:userId}
                });
            }

            //Lấy độ dài AcceptFriend 
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriend = infoUserB.acceptFriend.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriend : lengthAcceptFriend
            });

            //Lấy Info của A trả về cho B   
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND",{
                userId: userId,
                infoUserA : infoUserA
            });
            
        });

        //Lắng nghe Hủy gửi yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userId)=>{
            const myUserId = res.locals.user.id;
            const existUserAinB = await User.findOne({
                _id : userId,
                acceptFriend: myUserId
            });

            if(existUserAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {acceptFriend:myUserId}
                });
            }
            const existUserBinA = await User.findOne({
                _id : myUserId,
                requestFriend: userId
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {requestFriend:userId}
                });
            }

            //Lấy độ dài AcceptFriend 
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriend = infoUserB.acceptFriend.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriend : lengthAcceptFriend
            });

            //Lấy id của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USERID_CANCEL_FRIEND",{
                userIdA: myUserId,
                userIdB: userId
            });
        });

        //Lắng nghe Từ chối yêu cầu kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId)=>{
            const myUserId = res.locals.user.id;
            const existUserBinA = await User.findOne({
                _id : myUserId,
                acceptFriend: userId
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {acceptFriend:userId}
                });
            }
            const existUserAinB = await User.findOne({
                _id : userId,
                requestFriend: myUserId
            });

            if(existUserAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {requestFriend:myUserId}
                });
            }
        });

        //Lắng nghe Đồng ý yêu cầu kết bạn
        socket.on("CLIENT_ACCEPTED_FRIEND", async (userId)=>{
            const myUserId = res.locals.user.id;
            const existUserAinB = await User.findOne({
                _id : userId,
                requestFriend: myUserId
            });

            if(existUserAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {requestFriend:myUserId},
                    $push: {friendList:{
                                            user_id: myUserId,
                                            room_chat_id: ""
                                        }
                            }
                });
            }
            const existUserBinA = await User.findOne({
                _id : myUserId,
                acceptFriend: userId
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {acceptFriend:userId},
                    $push: {friendList:{
                                            user_id: userId,
                                            room_chat_id: ""
                                        }
                            }
                });
            }
        });

    });
};