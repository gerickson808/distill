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
	type: String

});

ProjectSchema.statics.createNewProject = function(project) {
	return Project.create(project)
	.then(function(newProject) {
		return Wireframe.create({
			project: newProject._id,
			master: true
		})
	})
};

ProjectSchema.methods.deleteProject = function() {
	var project = this;

	// return Wireframe.find({
	// 	project: project._id
	// })
	// 	.then(function(wireframes) {
	// 	var deletions = [];

	// 	wireframes.forEach(function(wireframe) {
	// 		deletions.push(wireframe.deleteWithComponents())
	// 	})
	// 	console.log(wireframes);
	// 	return Promise.all(deletions);
	// })
	return project.remove()
	.then(function() {
		return Wireframe.remove(project.wireframes)
	});
};

ProjectSchema.methods.setMaster = function(wireframe) {
	var project = this;
	return Wireframe.findOne({
		project: project._id,
		master: true
	})
	.then(function(oldMaster) {
		oldMaster.master = false
		return oldMaster.save()
	})
	.then(function() {
		wireframe.master = true;
		return wireframe.save();
	})
}

var Project = mongoose.model('Project', ProjectSchema);