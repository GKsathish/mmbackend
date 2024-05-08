const express = require("express");
const db = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route to get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
      return;
    }
    res.json(results);
  });
});

app.post('/usersadd', (req, res) => {
  const { username,email,password } = req.body;
  const create_datetime = new Date(); // Get the current timestamp

  db.query('INSERT INTO users (username,email,password,create_datetime) VALUES (?,?,?,?)', [username,email,password,create_datetime], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User added successfully' });
  });
});

app.post('/userlogin', (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  
  if (email && password) {
    const query = `
      SELECT * FROM users
      WHERE email = "${email}" AND password = "${password}"
    `;
    db.query(query, function(error, data) {
      if (error) {
        res.status(500).send('Internal Server Error');
        return;
      }
      
      if (data.length > 0) {
        res.status(200).send(
          {
          
          "message":"Success"
        }
        );
      } else {
        res.status(401).send('Incorrect Email or Password');
      }
    });
  } else {
    res.status(400).send('Please Enter Email Address and Password');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
