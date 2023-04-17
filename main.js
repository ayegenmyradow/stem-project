const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const db = require("./config/database");
const { authorization } = require("./middleware/jwt");
const { generateToken } = require("./services/jwtService");
const Config = require("./config");
const {
  modifyUserProfile,
  addEventService,
  getUsername,
  getBanners,
  getEvents,
  getUsers,
  getUser,
  getTags,
  addProject,
  getProjects,
} = require("./services/dbService");

const multer  = require('multer')
const upload = multer({ storage: multer.diskStorage({
  destination: './public/', filename: ( req, file, cb ) => cb( null, Date.now() + "_" + file.originalname)
})});

const app = express();
const port = 3000;
// general config
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser("ThisReallySecretKey!"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.get("/login", (req, res) => {
  res.render("login.html", { title: "Stem Group - login", errorMessage: null });
});
app.post("/login", (req, res) => {
  const body = req.body;
  if (!body.phone.match(/^\+9936[0-6][0-9]{6}$/)) {
    res.render("login.html", {
      title: "Stem Group - login",
      errorMessage: "phone is not correct",
    });
    return;
  }
  const query =
    "SELECT u.user_id, u.phone, u.password, u.name, u.surname FROM tbl_users u WHERE u.phone=?;";
  db.query(query, [body.phone], function (err, result) {
    if (err) {
      res.render("login.html", {
        title: "Stem Group - login",
        errorMessage: err.message,
      });
    } else {
      if (result.length === 0) {
        res.render("login.html", {
          title: "Stem Group - login",
          errorMessage: "User not found",
        });
        return;
      }
      const user = result[0];
      if (user.password !== body.password) {
        res.render("login.html", {
          title: "Stem Group - login",
          errorMessage: "Password is not correct",
        });
        return;
      }
      res.cookie("token", generateToken(user.user_id, Config.maxAge));
      res.cookie("name", user.name, { maxAge: 1000 * 60 * Config.maxAge });
      res.cookie("surname", user.surname, {
        maxAge: 1000 * 60 * Config.maxAge,
      });
      res.cookie("phone", user.phone, { maxAge: 1000 * 60 * Config.maxAge });
      res.cookie("user_id", user.user_id, {
        maxAge: 1000 * 60 * Config.maxAge,
      });
      res.redirect("/");
    }
  });
});
app.get("/register", (req, res) => {
  res.render("register.html", { title: "Stem Group - register" });
});
app.post("/register", (req, res) => {
  const body = req.body;
  if (body.password != body.password_retyped) {
    res.send("Not compatible - password does not match");
    return;
  }
  if (!body.phone.match(/^\+9936[0-6][0-9]{6}$/)) {
    res.send("Not compatible - phone is not correct");
    return;
  }
  const query =
    "INSERT INTO tbl_users(name, surname, email, phone, password) VALUES(?, ?, ?, ?, ?)";
  db.query(
    query,
    [body.name, body.surname, body.email, body.phone, body.password],
    function (err, result) {
      if (err) {
        res.send("Not compatible - " + err.message);
      } else {
        body.user_id = result.insertId;
        res.cookie("token", generateToken(body.user_id, Config.maxAge));
        res.cookie("name", body.name, { maxAge: 1000 * 60 * Config.maxAge });
        res.cookie("surname", body.surname, {
          maxAge: 1000 * 60 * Config.maxAge,
        });
        res.cookie("phone", body.phone, { maxAge: 1000 * 60 * Config.maxAge });
        res.cookie("user_id", body.user_id, {
          maxAge: 1000 * 60 * Config.maxAge,
        });
        res.redirect("/");
      }
    }
  );
});
app.use(authorization);
app.get("/", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  const banners = await getBanners(db);
  res.render("index.html", {
    banners: banners,
    title: "Stem Group",
    username: user,
    active: "home",
  });
});
app.get("/codes", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  res.render("codes.html", {
    users: [],
    title: "Stem Group",
    username: user,
    active: "codes",
  });
});
app.get("/sql", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  if (req.query.command) {
    console.log(decodeURIComponent(req.query.command));
    db.query(decodeURIComponent(req.query.command), function (err, result) {
      res.render("sql.html", {
        err,
        result: Array.isArray(result) ? result : [result],
        title: "Stem Group",
        username: user,
        command: req.query.command,
        active: "sql",
      });
    });
  } else {
    res.render("sql.html", {
      err: "",
      active: "sql",
      result: [],
      title: "Stem Group",
      username: user,
      command: req.query.command || "",
    });
  }
});
app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: 0, maxAge: 0 });
  res.cookie("name", "", { expires: 0, maxAge: 0 });
  res.cookie("surname", "", { expires: 0, maxAge: 0 });
  res.cookie("phone", "", { expires: 0, maxAge: 0 });
  res.cookie("user_id", "", { expires: 0, maxAge: 0 });
  res.redirect("/login");
});
app.get("/users", async (req, res) => {
  const users = await getUsers(db);
  res.render("users.html", {
    users: users,
    title: "Users",
    active: "users",
    username: await getUsername(db, req.credentials.user_id),
  });
});
app.get("/profile", async (req, res) => {
  const user = await getUser(db, req.credentials.user_id);
  res.render("profile.html", {
    user: user,
    title: "User profile",
    active: "",
    username: user.name + " " + user.surname,
  });
});
app.post("/profile", async (req, res) => {
  req.body.user_id = req.credentials.user_id;
  modifyUserProfile(db, req.body);
  res.redirect("/profile");
});
app.get("/events", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  function formatDate(dt) {
    dt = new Date(dt);
    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
  }
  const events = await getEvents(db, req.query.tag);
  const tags = await getTags(db);
  res.render("events.html", {
    title: "Stem Group - Events",
    active: "events",
    username: user,
    tags: tags,
    events: events.map(function (event) {
      event.start_time = formatDate(event.start_time);
      event.end_time = formatDate(event.end_time);
      return event;
    }),
  });
});
app.get("/add-event", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  res.render("add-event.html", {
    title: "Stem Group - Add new Event",
    username: user,
    active: "events",
  });
});
app.post("/add-event", async (req, res) => {
  try {
    await addEventService(db, req.body, req.credentials.user_id);
    res.redirect("/events");
  } catch (err) {
    res.send(err.message);
  }
});
app.get("/projects", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  const projects = await getProjects(db);
  res.render("projects.html", {
    title: "Stem Group - Projects",
    username: user,
    projects: projects,
    active: "projects",
  });
});
app.get("/add-project", async (req, res) => {
  const user = await getUsername(db, req.credentials.user_id);
  res.render("add-project.html", {
    title: "Stem Group - add project",
    username: user,
    active: "projects",
  });
});

app.post("/add-project", upload.single("image"), async (req, res) => {
  await addProject(db, {
    title: req.body.title, 
    description: req.body.description, 
    image: '/public/' + req.file.filename, 
    user_id: req.credentials.user_id
  })
  res.redirect("/projects")
});

app.listen(port, () => console.log(`App listening on port ${port}`));
