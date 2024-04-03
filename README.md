# Video Library API

## Overview
This API provides functionality to manage a video library, allowing users to interact with videos, genres, comments, and user profiles. It facilitates operations such as viewing, liking, disliking videos, managing user profiles, creating playlists, and interacting with comments.

## Base URL
- **Base URL**: `https://video-library-api-2-0.onrender.com/api/v1/`

## Endpoints

### Videos
- **GET /videos**: Retrieve all videos.
- **POST /videos**: Create a new video.
- **GET /videos/genres**: Get all genres of videos.
- **PATCH /videos/:id/views**: Increment views count for a specific video.
- **PATCH /videos/:id/like**: Like a specific video.
- **PATCH /videos/:id/dislike**: Dislike a specific video.
- **GET /videos/:id**: Get details of a specific video.
- **PATCH /videos/:id**: Update details of a specific video.
- **DELETE /videos/:id**: Delete a specific video.

### Users
- **POST /users/signup**: Sign up a new user.
- **POST /users/login**: Log in an existing user.
- **GET /users/my/profile**: Retrieve user profile.
- **PATCH /users/my/profile**: Update user profile.
- **GET /users**: Retrieve all users.
- **POST /users**: Create a new user.
- **PATCH /users/history**: Add a video to user's watch history.
- **GET /users/history**: Get user's watch history.
- **PATCH /users/history/clear**: Clear user's watch history.
- **PATCH /users/history/remove**: Remove a video from user's watch history.
- **GET /users/:id**: Get details of a specific user.
- **PATCH /users/:id**: Update details of a specific user.
- **DELETE /users/:id**: Delete a specific user.

### Playlists
- **GET /playlists**: Retrieve all playlists.
- **POST /playlists**: Create a new playlist.
- **GET /playlists/:playlistId**: Get details of a specific playlist.
- **DELETE /playlists/:playlistId**: Delete a specific playlist.
- **PATCH /playlists/:playlistId/videos/:videoId**: Add a video to a playlist.
- **DELETE /playlists/:playlistId/videos/:videoId**: Remove a video from a playlist.

### Comments
- **GET /comments**: Retrieve all comments.
- **POST /comments**: Create a new comment.

## Authentication
Some routes require authentication using JWT tokens. For such routes, the user needs to sign up or log in to obtain a token. This token should be included in the headers of the request for authentication.

