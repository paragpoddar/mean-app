import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

    constructor(private http: HttpClient, private router: Router) { }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
            .pipe(
                map(postData => {
                    return {
                        posts: postData.posts.map(post => {
                            return {
                                title: post.title,
                                content: post.content,
                                id: post._id,
                                imagePath: post.imagePath,
                                creator: post.creator
                            };
                        }),
                        maxPosts: postData.maxPosts
                    };
                }))
            .subscribe((transformedPostsData) => {
                this.posts = transformedPostsData.posts;
                this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts });
            });
        // return [...this.posts];

    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
            .subscribe((responseData) => {
                // const post: Post = {
                //     id: responseData.post.id,
                //     title: title,
                //     content: content,
                //     imagePath: responseData.post.imagePath
                // };
                // this.posts.push(post);
                // this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        return this.http.delete(BACKEND_URL + postId);
        // .subscribe(() => {
        //     // console.log('deleted');
        //     const updatedPosts = this.posts.filter(post => post.id !== postId);
        //     this.posts = updatedPosts;
        //     this.postsUpdated.next([...this.posts]);
        // });
    }

    getPost(id: string) {
        // return { ...this.posts.find(p => p.id === id) };
        return this.http
            .get<{
                _id: string,
                title: string,
                content: string,
                imagePath: string
            }>(BACKEND_URL + id);
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            console.log('got object', id, title, content, image);
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            };
        }
        this.http.put(BACKEND_URL + id, postData)
            .subscribe(response => {
                // const updatedPosts = [...this.posts];
                // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                // const post = {
                //     id: id,
                //     title: title,
                //     content: content,
                //     imagePath: 'response.imagePath'
                // };
                // updatedPosts[oldPostIndex] = post;
                // this.posts = updatedPosts;
                // this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

}
