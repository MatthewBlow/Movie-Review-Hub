import { Injectable } from '@angular/core';
import{ Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const BACKEND_URL = "http://localhost:3000/api/posts/"

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}


  getPosts(postsPerPage: number, currentPage: number){
    // Query parameters for the posts amount and page
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // Sending http GET request for the URL to retrieve the post data
    this.http
      .get<{message: string; posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      // Transfer the post data from the HTTP request into .pipe() method and .map() to alter array elements
      // This function is going to get the '_id' from the backend and store in the 'id' property from the Post model
      .pipe(map((postData) => {
        // Return the transformed post data
        return { posts: postData.posts.map((post : any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts
      };
      }))
      // Insert the transformed post data
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts});
      });
  }

  // Create listener for updated posts
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  // Fetch a single post
  getPost(id: string){
    // Send http GET request
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string; creator: string;}>(
      BACKEND_URL + id
    );
  }

  // Add a post
  addPost(title: string, content: string, image: File){
    // Create a form for post data and add the properties
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image ,title);
    // Sending HTTP POST request to the server with the post data
    this.http
      .post<{message: string, post: Post}>(
        BACKEND_URL,
        postData
      )
      // Reroute when successful
      .subscribe((responseData) =>{
        this.router.navigate(["/"]);
      });
  }


  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    // Check if the type of the file is an object, which what an image would be
    if (typeof image === "object") {
      // Post will need to be FormData() to accomodate the image
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      // If no image is present, send normal JSON data
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    // Update post to backend by sending an HTTP PUT request
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  // using http.delete to delete a post
  deletePost(postID : string) {
    return this.http
      .delete(BACKEND_URL + postID);
  }
}
