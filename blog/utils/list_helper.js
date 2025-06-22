const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0

    for(let i=0; i < blogs.length; i++)
        likes += blogs[i].likes

    return likes
}

module.exports = {
    dummy,
    totalLikes
}