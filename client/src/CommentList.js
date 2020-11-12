import React from 'react';

const CommentList = ({ comments }) => {
  const getListItem = (comment) => {
    switch (comment.status) {
      case 'approved':
        return <li key={comment.id}>{comment.content}</li>;
      case 'pending':
        return (
          <li key={comment.id}>
            <i>Comment under review</i>
          </li>
        );
      case 'rejected':
        return (
          <li key={comment.id}>
            <i>Comment removed</i>
          </li>
        );
      default:
    }
  };
  const renderedComments = comments.map((comment) => {
    return getListItem(comment);
  });
  return <ul>{renderedComments}</ul>;
};

export default CommentList;
