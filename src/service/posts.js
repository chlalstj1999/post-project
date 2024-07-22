const customError = require("../router/data/error")
const { getPosts, createPostRepo, isPost, putPost, getPost, deletePostRepo, isPostLike, postLikeRepo, postUnlikeRepo } = require("../repository/posts")
const { isCategory } = require("../repository/categorys")

const selectPosts = async (categoryIdx) => {
    const category = await isCategory(categoryIdx)
    if (!category) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    const posts = await getPosts(categoryIdx)

    return posts
}

const createPost = async (accountIdx, categoryIdx, title, content) => {
    const category = await isCategory(categoryIdx)
    if (!category) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    await createPostRepo(accountIdx, categoryIdx, title, content)
}

const udpatePost = async (postIdx, title, content) => {
    await putPost(postIdx, title, content)
}

const selectPost = async (postIdx) => {
    let post = await isPost(postIdx)
    if (!post) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    post = await getPost(postIdx)
    return post
}

const deletePost = async (postIdx) => {
    await deletePostRepo(postIdx)
}

const postLike = async (accountIdx, postIdx) => {
    const post = await isPost(postIdx)
    if (!post) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    const ispostLike = await isPostLike(accountIdx, postIdx)
    if (!ispostLike) {
        await postLikeRepo(accountIdx, postIdx)
    } else {
        await postUnlikeRepo(accountIdx, postIdx)
    }
}

module.exports = { selectPosts, createPost, udpatePost, selectPost, deletePost, postLike }