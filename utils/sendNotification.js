const admin = require('./../config/firebase')
const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};


const sendNotificationToAllUsers = async (tokens, message) => {
    try {
        const promises = tokens.map(async token => {
            return await admin.messaging().send({
                token,
                webpush: {
                    data: {
                        title: message.title,
                        body: message.body,
                        image: message.image,
                        icon: 'https://png.pngtree.com/png-vector/20190215/ourmid/pngtree-play-video-icon-graphic-design-template-vector-png-image_530837.jpg'
                    }
                }
            })
        })
        const res = await Promise.all(promises);
        console.log('notification sent successfully')
    } catch (err) {
        console.log(err)
    }
}
module.exports = { sendNotificationToAllUsers }