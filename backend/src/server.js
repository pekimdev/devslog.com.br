const express = require('express');
const app = express();

const cors = require('cors');

require('./db/config/config')
 

const userRoutes = require('./routes/userRoutes');

app.use(cors());

app.use(express.json());



app.use(userRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
