import { Component, OnDestroy, OnInit } from "@angular/core";

import { Post } from '../post.model';
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts : Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated = false;
  userID : string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService){}

  ngOnInit(){
    this.isLoading = true;
    // Calls .getPosts() method to retrieve posts
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // Fetch user ID
    this.userID = this.authService.getUserID();
    // Fetch all posts from server
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    // Check if user is authenticated
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userID = this.authService.getUserID();
      });
  }

  // Changes the page and post per page based on selection
  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }


  onDelete(postID: string){
    this.isLoading = true;
    // Delete post using .deletePost() method and parameter 'Post ID'
    this.postsService.deletePost(postID).subscribe(() =>{
      // Refresh and retrieve all posts once deleted
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  // Unsubscribe from listeners
  ngOnDestroy(){
     this.postsSub.unsubscribe();
     this.authStatusSub.unsubscribe();
  }
}
