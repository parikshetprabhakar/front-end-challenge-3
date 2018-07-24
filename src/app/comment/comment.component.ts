import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormArray, FormBuilder, FormControl,
  FormGroup, FormsModule, Validators
} from '@angular/forms';
import { COMMENTS } from './comment.data';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit,  OnDestroy  {
  commentBox: FormGroup;
  signupForm: FormGroup;
  replyBox: FormGroup;
  newComment: any;
  comments: any;
  replyIndex: number;
  replyFormShow = false;
  newReply: any;
  like: boolean;
  storedComments: any;
  userId = 0;
  key = 'comments';
  userKey = 'user';
  userInfo: any;
  signupDone = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.newComment = '';
    this.userInfo = [{
      'userName': '',
    }];
    this.like = false;
    this.storedComments = COMMENTS;
    this.createSignipForm();
  }

  updateLocalStorage() {
    localStorage.setItem(this.userInfo[0].userName, JSON.stringify(this.comments));
  }

  createSignipForm() {
    this.signupForm = this.fb.group({
      'userName': ['', Validators.required]
    });
  }

  signUp() {
    if (this.signupForm.valid) {
      this.userInfo[0].userName = this.signupForm.controls['userName'].value;
      this.signupDone = true;
      if (localStorage.getItem(this.userInfo[0].userName) !== null) {
        this.comments = JSON.parse(localStorage.getItem(this.userInfo[0].userName));
      } else {
        localStorage.setItem(this.userInfo[0].userName, JSON.stringify(this.storedComments));
        this.comments = JSON.parse(localStorage.getItem(this.userInfo[0].userName));
      }
      this.createForm();
    }
  }

  createForm() {
    this.commentBox = this.fb.group({
      'userName': [this.userInfo[0].userName],
      'comment': ['', Validators.required],
      'reply': [[]],
      'liked': [false],
      'like': [0]
    });
  }

  addComment() {
    if (this.commentBox.valid) {
      this.newComment = this.commentBox.value;
      this.comments.push(this.newComment);
      this.createForm();
      this.updateLocalStorage();
    }
  }

  delete(index) {
    this.comments.splice(index, 1);
    this.updateLocalStorage();
  }

  replyForm(index) {
    if (!this.replyFormShow) {
      this.replyIndex = index;
      this.replyFormShow = true;
      this.replyBox = this.fb.group({
        'userName': [this.userInfo[0].userName],
        'userReply': ['', Validators.required],
        'liked': [false],
        'like': ['0']
      });
    } else if(index !== this.replyIndex && this.replyFormShow) {
      this.replyIndex = index;
      this.replyBox = this.fb.group({
        'userName': [this.userInfo[0].userName],
        'userReply': ['', Validators.required],
        'liked': [false],
        'like': ['0']
      });
    }
    else {
      this.replyFormShow = false;
    }
    this.updateLocalStorage();
  }

  replyAdded(index) {
    if (this.replyBox.valid) {
      this.newReply = this.replyBox.value;
      this.comments[this.replyIndex].reply.push(this.newReply);
      this.replyFormShow = false;
      this.updateLocalStorage();
    }
  }

  deleteReply(index, replyIndex) {
    this.comments[index].reply.splice(replyIndex, 1);
    this.updateLocalStorage();
  }

  liked(index) {
    if (!this.comments[index].liked) {
      this.comments[index].like = this.comments[index].like + 1;
      this.comments[index].liked = true;
    } else {
      this.comments[index].like = this.comments[index].like - 1;
      this.comments[index].liked = false;
    }
    this.updateLocalStorage();
  }

  likedReply(index, replyIndex) {
    if (!this.comments[index].reply[replyIndex].liked) {
      this.comments[index].reply[replyIndex].like = this.comments[index].reply[replyIndex].like + 1;
      this.comments[index].reply[replyIndex].liked = true;
    } else {
      this.comments[index].reply[replyIndex].liked = false;
      this.comments[index].reply[replyIndex].like = this.comments[index].reply[replyIndex].like - 1;
    }
    this.updateLocalStorage();
  }
  ngOnDestroy() {

  }
}
