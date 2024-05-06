const express = require('express')
const app = express()
const fs = require("fs")
const path = require("path");
const port = 3000
const collection = require("./backend/mongodb");
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
const basicAuth = require('express-basic-auth')
const bcrypt = require('bcrypt');


async function authorizer(username, password, cb) {
  try {
    const usersData = await authService.getAllUsers();
    const admins = usersData.map(user => ({
      name: user.name,
      password: user.password
    }));

    for (const admin of admins) {
      const isUsernameValid = basicAuth.safeCompare(username, admin.name);
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (isUsernameValid && isPasswordValid) {
        console.log("accept");
        return cb(null, true);
      }
    }

    console.log("refus");
    return cb(null, false);
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    return cb(error);
  }
}
app.get('/students', (req, res) => {
  authService.getAllStudents()
  .then(studentsData => {
    // Mapper les données des étudiants pour extraire les détails pertinents
    const students = studentsData.map(student => ({
      id: student._id,
      name: student.name,
      school: student.school
    }));
    
    // Rendre le modèle avec les données d'étudiant
    res.render("students", { students: students });
  })
  .catch(error => {
    // Gérer les erreurs de récupération des données des étudiants
    console.error('Erreur lors de la récupération des données des étudiants :', error.message);
    res.status(500).send('Erreur lors de la récupération des données des étudiants');
  });
});
app.use('/students', basicAuth({
  authorizer: authorizer,
  authorizeAsync: true,
  challenge: true
}));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"))
})

app.use(express.static("public"))

app.listen(port, () => {
  console.log(`My app is listening on port ${port}`)
})



app.get('/register', (req, res) => {
  res.render("register")
})
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));





const authService = require('./service/authService')
/* app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  console.log(name,password);
  
  try {
    // Appelez votre fonction loginUser du service d'authentification
    const responseData = await authService.loginUser({ name, password });
    console.log(responseData.message);
    const notifier = require('node-notifier');

    switch (responseData.message) {
      case 'okay okay':
        req.session.username= "username";
        req.session.password = "password";
        res.redirect('/students');
        break;
        
      case 'Invalid  mail!':
        notifier.notify({
          title: 'Notification',
          message: 'Invalid name!',
          sound: true
        });
        break;

        case 'Invalid  password!':
          notifier.notify({
            title: 'Notification',
          message: 'Invalid password!',
          sound: true
        });
        break;
    }

  }
  
  catch (error) {
    // Gérez les erreurs
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}); */




  

  app.post("/register", async (req, res) => {
  console.log("aaa");
  const { name, password } = req.body;
  try {
    const responseData = await authService.registerUser({ name, password });
    console.log(responseData.message);
    const notifier = require('node-notifier');
    console.log('name',name);
    console.log('password',password);
    
    switch (responseData.message) {
      case 'Email Already Verified!':
        notifier.notify({
          title: 'Notification',
          message: 'Email Already Verified!',
          sound: true
        });
        break;
        
      case 'Email Verified, Please Login Now!':
        /* notifier.notify({
          title: 'Notification',
          message: 'Email Verified, Please Login Now!',
          sound: true
        }); */
        res.redirect('/students');
        break;
        
        case 'Name or Password empty':
          notifier.notify({
            title: 'Notification',
            message: 'Name or Password empty',
            sound: true
          });
          break;
          
          default:
            // Gérer les autres cas si nécessaire
            break;
          }
          
        }
        
  catch (error) {
    // Gérez les erreurs
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});




app.get('/students', (req, res) => {
  
  res.render("students", { students: students });
});
