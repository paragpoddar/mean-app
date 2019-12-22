import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    enteredContent = '';
    enteredTitle = '';
    // @Output() postCreated = new EventEmitter<Post>();
    private mode = 'create';
    private postId: string;
    post: Post;
    isLoading = false;
    form: FormGroup;
    imagePreview: string | ArrayBuffer;

    constructor(public postService: PostService, public route: ActivatedRoute) { }

    ngOnInit() {
        this.form = new FormGroup({
            'title': new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3)]
            }),
            'content': new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator
                    };
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0]; // file is an object
        this.form.patchValue({ image: file }); // storing file object

        /**
         * informs angular that i changed the value and it should re-evaluate that,
         * store that value internally and also check whether the value i did path
         * is valid
         */
        this.form.get('image').updateValueAndValidity();

        // console.log(file);
        // console.log(this.form);

        const reader = new FileReader(); // create reader

        // finding something what should happen when its done reading in a file
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

}
