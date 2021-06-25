const Post = require('../models/post');

// Javascript module for creating a post

exports.createPost = (req, res, next) => {
  // Constant to hold url
  const url = req.protocol + "://" + req.get("host");
  // Constant to create a  new Post object using post model
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userID
  });
  // .save() function to save post to the database
  post.save()
    // saving output data as json
    .then(createdPost =>{
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost,
          postID: createdPost._id
        }
      });
  })
  // Catch and output for errors
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
}


// Javascript module for updating a post

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  // Constant to hold url with the imagepath
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  // Constant to create a  new Post object using post model
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userID
  });
  // Using mongoose .updateOne() function to update post using ID parameters
  Post.updateOne({ _id: req.params.id, creator: req.userData.userID}, post)
    .then(result => {
    if(result.n > 0){
      res.status(200).json( {message: 'Update successful'});
    } else {
      res.status(401).json( {message: 'Not authorized!'});
    }
  })
  // Catch error for output
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
}

// Javascript module to get fetch all posts

exports.getPosts = (req, res, next) => {
  // Constants to get page index
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  // Const to store all documents using the Posts model
  // Using .find() moongoose function
  const postQuery = Post.find();
  let fetchedPosts;

  // Checking if page size and current page are not undefined
  if(pageSize && currentPage){
    postQuery
      //Skipping items of collections to display correct ones on page
      .skip(pageSize * (currentPage - 1))
      //Limiting the amount of documents returned
      .limit(pageSize);
  }

  // Executing the post query
  postQuery.then(documents =>{
      // Assigning data from documents promise to the fetchedPosts variable
      fetchedPosts = documents
      //Return amount of posts fetched
      return Post.count();
    })
    .then(count => {
      // Sends status and JSON response with posts data
      res.status(200).json({
        message: "Posts fetch successfully!",
        posts: fetchedPosts,
        // Assign amount of posts fetched
        maxPosts: count
      });
    })
    // Catch error for output
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    });
}

// Javascript module for fetching a single post

exports.getPost = (req, res, next) => {
  // Finding a post using the Post model
  // and .findById() Mongoose function
  Post.findById(req.params.id).then(post => {
    // Check if a post has returned
    if(post){
      // Output the returned post data
      res.status(200).json(post);
    } else {
      // Output error response
      res.status(404).json({message: 'Post not found! '});
    }
    // Catch other errors
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

// Javasript module to delete a single post

exports.deletePost = (req, res, next) => {
  // using mongoose function .deletePost() delete post using ID parameters
  Post.deleteOne({_id: req.params.id, creator: req.userData.userID })
    // Logging data in JSON response
    .then(result => {
      console.log(result);
      // Checking if a deletion has occured
      if(result.n > 0){
        // Status and JSON response if successful
        res.status(200).json( {message: 'Deletion successful'});
      } else {
        // Status and JSON response if user is not authorized to delete post
        res.status(401).json( {message: 'Not authorized!'});
      }
      // Catch any errors
    }).catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    });
}
