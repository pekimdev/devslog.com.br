const express = require('express');
const app = express();

const cors = require('cors');

require('./db/config/config')
 

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const responseRoutes = require('./routes/responseRoutes');

app.use(cors());

app.use(express.json());



app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(responseRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
