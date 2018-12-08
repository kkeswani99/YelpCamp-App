var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//You are displaying all the campgrounds
//INDEX Route!!!!!
router.get("/",function(req,res){
   //Get all campgrounds from the databse
   Campground.find({}, function(err, allCampgrounds){
   	if(err)
   	{
   		console.log(err);
   	}
   	else
   	{
   		res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
   	}
   })
    
});
//Here you are adding a new dog to the database
//CREATE Route!!!!
router.post("/",middleware.isLoggedIn, function(req,res){
    //get data from form an add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
    	id: req.user._id,
    	username: req.user.username
    }
    var price = req.body.price;
    var newCampground = {name: name, image: image, description: desc, author: author, price:price};
    //Create a new Campground and save it to database
    Campground.create(newCampground, function(err, newlycreated){
    	if(err){
    		console.log(err);
    	}
    	else
    	{
    		//redirect back to campgrounds page
    		console.log(newlycreated);
    		res.redirect("/campgrounds");
    	}
    }) 
});

//Here you are displaying a form to make a new route 
//NEW Route!!!!
router.get("/new",middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new"); 
});

//Here we are showing more information about a particular campground 
// SHOW Route!!!!!!!
router.get("/:id", function(req,res){
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	//render show template with that campground
	//res.send("This will be the showpage one day!!!");
});

//EDIT CAMPGROUND
router.get("/:id/edit",middleware.CheckCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
//UPDATE CAMPGROUND
router.put("/:id", middleware.CheckCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
		if(err)
		{
			res.redirect("/");
		}
		else
		{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.CheckCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err)
		{
			res.redirect("/campgrounds");
		}
		else
		{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;