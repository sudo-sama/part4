const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response, next) => {
    try{
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    }catch(error){
        next(error)
    }
})

router.post('/', async (request, response, next) => {
    const { title, author, url, likes } = request.body

    const decodedUser = request.user

    if(!decodedUser.id)
        return response.status(403).send({error: 'You are not authorized!'})

    const user = await User.findById(decodedUser.id)

    if(!user)
        return response.status(403).send({error: 'You are not authorized'})

    if(!title || !url)
        return response.status(400).send({error: 'Bad Request'})

    try{
        const blog = new Blog({
            title: title,
            author: author,
            url: url,
            likes: likes || 0,
            user: user.id
          })
          const savedBlog = await  blog.save()
          
          user.blogs = user.blogs.concat(savedBlog._id)
          await user.save()
          response.status(201).json(savedBlog)

    }catch(error){
        next(error)
    }
})

router.delete('/:id', async (request, response, next)=>{
    const id = request.params.id
    try{
        const user = await User.findById(request.user.id)
        if(!user)
            return response.status(404).send({error: 'User does not exist'})
        
        console.log(user.blogs[0].toString())

        user.blogs = user.blogs.filter(b => b.toString() !== id)

        await user.save()

        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    }
    catch(error){
        next(error)
    }
})

router.put('/:id', async (request, response, next) => {
    const id = request.params.id
    const { title, author, url, likes } = request.body

    if(!title || !url)
        return response.status(400).send({error: 'Bad Request'})

    const blog = await Blog.findById(id)

    if(!blog)
        return response.status(404).send({error: 'Blog not found!'})

    blog.likes = likes

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
})

module.exports = router