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
const notifier = require('node-notifier');
const authService = require('./service/authService')


app.use(express.static("public"))


async function authorizer(username, password, cb) {
  try {
    const usersData = await authService.getAllUsers();
    const admins = usersData.map(user => ({
      name: user.name,
      password: user.password
    }));

    for (const admin of admins) {
      const isUsernameValid = basicAuth.safeCompare(username, admin.name);
      const isPasswordValid = basicAuth.safeCompare(password, admin.password);
      if (isUsernameValid && isPasswordValid) {
        console.log("accept");
        return cb(null, true);
      }
    }
    notifier.notify({
      title: 'Notification',
      message: 'MDP incorrect',
      sound: true
    });
    return cb(null, false);
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    return cb(error);
  }
}
const basicAuthMiddleware = basicAuth({
  authorizer: authorizer,
  authorizeAsync: true,
  challenge: true
});
app.get('/students', basicAuthMiddleware, (req, res) => {

  authService.getAllStudents() 
    .then(studentsData => {
      const students = studentsData.map(student => ({
        id: student._id,
        name: student.name,
        school: student.school
      }));

      res.render("students", { students: students });
    })
    .catch(error => {
      // Gérer les erreurs de récupération des données des étudiants
      console.error('Erreur lors de la récupération des données des étudiants :', error.message);
      res.status(500).send('Erreur lors de la récupération des données des étudiants');
    });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"))
})


app.listen(port, () => {
  console.log(`My app is listening on port ${port}`)
})



app.get('/register', (req, res) => {
  res.render("register")
})
const bodyParser = require('body-parser');
const { log } = require('console');
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/editStudent", async (req, res) => {
  const { id, name, school } = req.body;
  const student = {
    name: name,
    school: school
  };
  console.log("student");
  console.log(student);
  
  try {
    const responseData = await authService.editStudent(id, student);
    console.log("responseData", responseData.message);
    
    if (responseData.message === 'student Updated Successfully!') {
      notifier.notify({
        title: 'Notification',
        message: 'Étudiant mis à jour',
        sound: true
      })
      
      res.redirect('/students')

    } else {
      notifier.notify({
        title: 'Notification',
        message: "Erreur dans l'ID",
        sound: true
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'édition de l'étudiant :", error);
  }
});





app.post("/register", async (req, res) => {
  const { name, password } = req.body;
  try {
    const responseData = await authService.registerUser({ name, password });
    console.log(responseData.message);
    console.log('name', name);
    console.log('password', password);

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


app.get('/students/:id', basicAuthMiddleware, (req, res) => {
  const studentId = req.params.id;

  authService.getAllStudents()
    .then(studentsData => {
      const studentIndex = parseInt(studentId); // Convertir l'ID de l'étudiant en nombre entier
      const student = studentsData[studentIndex]; // Récupérer l'étudiant correspondant à l'ID

      if (!student) {
        // Si aucun étudiant n'est trouvé avec cet ID, renvoyez une erreur 404
        return res.status(404).send('Étudiant non trouvé');
      }

      // Rendre la page de l'étudiant en passant les données de l'étudiant à la vue
      res.render('student', { student: student });
    })
    .catch(error => {
      // Gérer les erreurs de récupération des données de l'étudiant
      console.error('Erreur lors de la récupération des données de l\'étudiant :', error.message);
      res.status(500).send('Erreur lors de la récupération des données de l\'étudiant');
    });
});



