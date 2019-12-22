import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     { title: 'first post title', content: 'first post content' },
    //     { title: 'second post title', content: 'second post content' },
    //     { title: 'third post title', content: 'third post content' }
    // ];
    posts: Post[] = [];
    private postsSub: Subscription;
    isLoading = false;
    private authStatusSub: Subscription;
    userIsAuthenticated = false;
    userId: string;
    totalPosts = 0;
    postsPerPage = 2;
    pageSizeOptions = [1, 2, 5, 10];
    currentPage = 1;

    constructor(private postService: PostService, private authService: AuthService) { }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    ngOnInit() {
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSub = this.postService
            .getPostUpdateListener()
            .subscribe((postData: { posts: Post[], postCount: number }) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                this.posts = postData.posts;
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        console.log(pageData);
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

}
