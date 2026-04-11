const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tamratdereje56_db_user:9OF8mj4fbHt7sqRr@cluster0.wlerma6.mongodb.net/aethelgard?retryWrites=true&w=majority&appName=Cluster0')
  .then(()=> {
    console.log('SUCCESS: Connection string works!'); 
    process.exit(0);
  })
  .catch(e => {
    console.error('ERROR: ', e.message); 
    process.exit(1);
  });
