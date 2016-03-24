var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');

var ProjectSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	team: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Team',
		//required:true
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User',
	},
	wireframes: [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Wireframe',
	}],
	type: String //what is this for?

});

ProjectSchema.statics.createNewProject = function(project) {
	var wireframe;

	return Wireframe.create({
		master: true
	})
	.then(function(createdWireframe) {
		wireframe = createdWireframe;
		project.wireframes = [wireframe._id];
		return Project.create(project);
	})
	.then(function() {
		return wireframe;
	})

};

ProjectSchema.methods.deleteProject = function() {
	var project = this;

	return project.remove()
	.then(function() {
		return Wireframe.remove(project.wireframes)
	});
};

ProjectSchema.methods.setMaster = function(wireframe) {
	var project = this;
	var projectWireframes = project.wireframes;

	return Wireframe.findOne({
		master: true,
		_id: { $in: { projectWireframes }}
	})
	.then(function(oldMaster) {
		oldMaster.master = false
		return oldMaster.save()
	})
	.then(function() {
		wireframe.master = true;
		return wireframe.save();
	});
}


var Project = mongoose.model('Project', ProjectSchema);