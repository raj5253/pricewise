import mongoose, { mongo } from "mongoose";    

let isConnected = false;

export const  connectToDB  =async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI)return console.log("MONGODB_URI is not defined");

    if(isConnected) console.log("=> using existing database connection")

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB Connected!')

    } catch (error) {
        console.log(error)
    }
}

//Two types of connecting are there. 
// M-1 dontfix the database name in .env. In lib/mongodb, use mongodb, not mongoose. create connection to altas, with specifying the db_name

// M-2 dont fix the database name. In lib/mongodb, use mongoose and specify db there only. You create models using mongoose. make queries with models you created. As percheck in constructor for Models is made by mogoose.schema

// M-3 the best. fix the database name in .env.  In lib/mongodb, use mongoose to connect.You create models using mongoose. Make queries with models you created.
// I prefer M-3