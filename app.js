var express 	     = require("express"),
	  app 		       = express(),
	  bodyParser     = require("body-parser"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
	  mongoose 	     = require("mongoose"),
    flash          = require("connect-flash"), 
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds")

//Requiring Routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")

//seedDB(); //seed the databse
// mongodb://karan:karanyelpcamp30@ds227594.mlab.com:27594/karanyelpcamp
mongoose.connect("mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb://karan:karanyelpcamp30@ds227594.mlab.com:27594/karanyelpcamp");
console.log(process.env.DATABASEURL);
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Once again rusty wins cutest dog",
  resave: false,
  saveUninitialized: false
}));

var port = process.env.PORT;

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
 });

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port||3000,function(){
   console.log("Server has started!!!"); 
});

