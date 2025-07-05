const uploadCloud = require("../../helpers/upload-cloudinary");
const Chat = require("../../models/chat.model");


module.exports =  (res) =>{
    // Lắng nghe Socket
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data)=>{
            let images = [];

            for (const image of data.images){
                const link = await uploadCloud(image);
                images.push(link);
            };

            const chat = new Chat({
                user_id: res.locals.user.id,
                content: data.content,
                images : images
            });
            await chat.save();
            //Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE",{
                userId: res.locals.user.id,
                fullName: res.locals.user.fullName,
                content: data.content,
                images : images 
            })
        });

        //typing
        socket.on("CLIENT_SEND_TYPING", async (type)=>{
            socket.broadcast.emit("SERVER_RETURN_TYPING",{
                userId: res.locals.user.id,
                fullName: res.locals.user.fullName,
                type: type
            });
        });


    });
    // End Socket
}