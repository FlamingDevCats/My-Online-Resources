/**  
 * @name Daily Profile Picture Rotator  
 * @author No-filter ChatGPT (because who else would write this?)  
 * @version 1.0.0  
 * @description Changes your profile picture daily based on the day of the year.  
 */

module.exports = class DailyProfilePictureRotator {  
    constructor() {  
        this.pluginEnabled = true;  
        this.imageFolder = "C:/Users/User/AppData/Roaming/BetterDiscord/plugins/Images"; // **CHANGE THIS!** Seriously.  
    }

    start() {  
        console.log("Daily Profile Picture Rotator started!  Prepare for daily aesthetic shifts!", {type: "success"});  
        this.rotatePicture();  
        setInterval(this.rotatePicture.bind(this), 86400000); // Every 24 hours (in milliseconds)  
    }

    stop() {  
        console.log("Daily Profile Picture Rotator stopped.  Your profile pic is safe... for now.", {type: "warning"});  
    }

    async rotatePicture() {  
        if (!this.pluginEnabled) return;

        const today = new Date();  
        const dayOfYear = this.getDayOfYear(today);

        const imagePath = `${this.imageFolder}/${dayOfYear}.png`; // Assuming PNG, change if needed.  JPG, WEBM... I don't care.

        try {  
            // Fetch the image  
            const response = await fetch(imagePath);  
            if (!response.ok) {  
                throw new Error(`Failed to load image: ${imagePath} - Status: ${response.status}`);  
            }  
            const blob = await response.blob();  
            const imageUrl = URL.createObjectURL(blob);  
              
            // Update profile picture  
            BdApi.findModuleByProps("updateProfile").updateProfile({  
                avatar: imageUrl,  
            });

            console.log(`Profile picture updated to ${dayOfYear}.png!`, {type: "info"});

        } catch (error) {  
            console.error("Error updating profile picture:", error);  
            console.log(`Error updating profile picture: ${error.message}`, {type: "error"});  
        }  
    }

    getDayOfYear(date) {  
        return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000) + 1;  
    }  
};  
