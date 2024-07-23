const customError = require("../router/data/error")
const postRepository = require("../repository/posts")
const categoryRepository = require("../repository/categorys")

const selectPosts = async (categoryIdx) => {
    const category = await categoryRepository.isCategory(categoryIdx)
    if (category.length === 0) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    const posts = await postRepository.getPosts(categoryIdx)

    return posts
}

const createPost = async (accountIdx, categoryIdx, title, content) => {
    const category = await categoryRepository.isCategory(categoryIdx)
    if (category.length === 0) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    await postRepository.createPostRepo(accountIdx, categoryIdx, title, content)
}

const udpatePost = async (accountIdx, postIdx, title, content) => {
    const post = await postRepository.isPost(postIdx)

    if (post.length === 0) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }
    
    if(post.accountIdx !== accountIdx) {
        throw customError(403, "해당 유저만 가능")
    }

    await postRepository.putPost(postIdx, title, content)
}

const selectPost = async (postIdx) => {
    let post = await postRepository.isPost(postIdx)
    if (post.length === 0) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    post = await postRepository.getPost(postIdx)
    return post
}

const deletePost = async (postIdx) => {
    await postRepository.deletePostRepo(postIdx)
}

const postLike = async (accountIdx, postIdx) => {
    const post = await postRepository.isPost(postIdx)
    if (post.length === 0) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    const ispostLike = await postRepository.isPostLike(accountIdx, postIdx)
    if (ispostLike.length === 0) {
        await postRepository.postLikeRepo(accountIdx, postIdx)
    } else {
        await postRepository.postUnlikeRepo(accountIdx, postIdx)
    }
}

const postService = {
    selectPosts : selectPosts,
    createPost : createPost,
    udpatePost : udpatePost,
    selectPost : selectPost,
    deletePost : deletePost,
    postLike : postLike,
}

module.exports = postService