const admin = require('./../config/firebase')
const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};


const sendNotificationToAllUsers = async (tokens, message) => {
    try {
        const promises = tokens.map(async token => {
            return await admin.messaging().send({
                notification: {
                    title: message.title, body: message.body, image: message.image
                }
                , token
            })
        })
        const res = await Promise.all(promises);
        console.log('notification sent successfully')
    } catch (err) {
        console.log(err)
    }
}
module.exports = { sendNotificationToAllUsers }