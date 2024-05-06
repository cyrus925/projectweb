const express = require("express");
const mongoose = require("mongoose");

const app = express();

const MONGO_URI = "mongodb+srv://cyruslarger:mangodb92!@cluster0.lb52vww.mongodb.net/";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connexion à MongoDB réussie');
})
.catch((error) => {
  console.error('Échec de la connexion à MongoDB :', error);
});

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const students = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    }
});
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const User = mongoose.model('User2', logInSchema);
const Student = mongoose.model('Student', students);

const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userData = {
      name,
      password,
    };
    const isAdded = await User.find({ name }).maxTimeMS(2000000);;
    console.log("isAdded", isAdded);
    if (isAdded) {
      console.log("isAdded.password", isAdded[0].password);
      console.log("password", password);
      if (isAdded[0].password === password) {
        res.send({
          message: "okay okay"
        });
      } else {
        console.log("else");
        res.send({
          message: "Invalid  password!",
        });
      }
    }
    else {
      res.send({
        message: "Invalid  mail!",
      });
    }
  } catch (err) {
    res.send({
      message: "Invalid  mail!",
    });
  }
};

const router = express.Router();
  
// Définition de la route de connexion sur le routeur

  
  // Démarrer le serveur Express
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
  
  
  const registerUser = async (req, res) => {
    const { name, password } = req.body;
    const isAdded = await User.find({ name }).maxTimeMS(2000000);
    console.log("isAdded", isAdded)
    if (isAdded.length > 0) { // Vérifiez la longueur du tableau
        console.log("ok on te connait");
        return res.send({
            message: "Email Already Verified!",
        });
    }
    if (!name || !password) {
        return res.send({
            message: "Name or Password empty",
        });
    }
    const newUser = new User({
        name,
        password,
    });
    newUser.save();
    console.log("ok on te connait pas");
    return res.send({
        message: "Email Verified, Please Login Now!",
    });
};

  // Définition de la route de connexion sur le routeur
  
    const getAllUsers = async (req, res) => {
      try {
        const users = await User.find({}).sort({ _id: -1 });
  
        res.send(users);
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
      };
    const addStudents = async (req, res) => {
      console.log("req", req.body);
      try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(200).send({
          message: "Student Added Successfully!",
        });
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
    }; 

    
    
    
    
    const editStudent = async (req, res) => {
      try {
        const student = await Student.findById({ _id: req.params.id });
        console.log("req id : ", req.params.id);
        console.log("student", student);
        if (student) {
          student.name = req.body.name;
          student.school = req.body.school;
          await student.save();
          res.send({ message: "student Updated Successfully!" });
        }
      }
      catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
    }
    router.put("/:id", editStudent);
    const getAllStudents = async (req, res) => {
      try {
        
        const students = await Student.find({}).sort({ _id: -1 });
        console.log(students);
        res.send(students);
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
    };
    const getStudent = async (req, res) => {
      try {
        const student = await Student.findById({ _id: req.params.id });
  
        res.send(student);
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
    };
    app.use("/api/student", router);
    router.post("/add",addStudents);
    router.get('/all', getAllStudents);
    router.get('/:id', getStudent);
    router.post("/login",loginUser);
  

    app.use("/api/user", router);
    router.post("/register",registerUser);
    
    // Monter le routeur sur l'application principale
    
    router.get("/all",getAllUsers);

  
    
      