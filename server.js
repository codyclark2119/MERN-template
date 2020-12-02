const express = require("express");
const app = express();
const Routes = require("./routes/index.js");
const connectDb = require("./config/db");
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(Routes);
connectDb();

const PORT = process.env.PORT || 4000;

// Serve static build in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));
    //Send the build of react to every URL in production
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
};

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));