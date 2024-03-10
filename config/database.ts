import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return true;
    }   

    try {
        await mongoose.connect('mongodb+srv://tranquoc17082002:gKRlpgDaxs1KPs6y@cluster0.ayyjvvb.mongodb.net/connectdb' || '');

        console.log('Connected Database');
        
        return true;
    } catch (e){
        console.log('ERROR: Database: ', e);
        
    }
}

export {connectDB}