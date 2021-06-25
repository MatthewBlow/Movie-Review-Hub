import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType} from "./mime-type.validator"

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  // Variables
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  private mode = "create";
  private postID: string;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(){
    // Get User Auth Status
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      }
    );
    // Creating a structured form for the post
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    // Getting parameters of route by using ParamMap
    this.route.paramMap.subscribe((paramMap : ParamMap) => {
      // Checking if the route has a postID attached to it
      if(paramMap.has('postID')){
        // If so, the post exists and is therefore being edited instead of created
        this.mode = 'edit';
        this.postID = paramMap.get('postID');
        this.isLoading = true;
        // Using created .getPost() method to retrieve the post data
        this.postsService.getPost(this.postID).subscribe(postData => {
          this.isLoading = false;
          // Applying the post data from the server into the created 'post' object
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          // Set the value of the formgroup with the data from the 'post' object
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
        // If a 'PostID' is not present in the post, then its a new post and will be in create mode
      } else {
        this.mode = 'create';
        this.postID = null;
      }
    });
  }
  // Event called on file picker
  onImagePicked(event: Event){
    // Get file from file picker
    const file = (event.target as HTMLInputElement).files[0];
    // Assign the 'file' value to the 'image' control of the form
    this.form.patchValue({image: file});
    // Update the new value to the form
    this.form.get("image").updateValueAndValidity();
    // Define reader and its load process
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    // Loading the file
    reader.readAsDataURL(file);
  }


  onSavePost(){
    // Check if all post information provided is valid
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    // If post is in 'create' mode, it will call the .addPost method to generate a new post
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    // Otherwise it is in 'edit' mode and will call the .updatePost method to update a currently existing post
    } else {
      this.postsService.updatePost(
        this.postID,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    // Reset form group values
    this.form.reset();
  }

  // Unsubscribe from Auth status subscription
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
