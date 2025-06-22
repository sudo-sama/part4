const { beforeEach, test, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')

const dummyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    for(let i = 0; i < dummyBlogs.length; i++){
        const blog = new Blog(dummyBlogs[i])
        await blog.save()
    }
})

test('correct number of blogs are returned', async () => {
    const response = await api
                        .get('/api/blogs')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, dummyBlogs.length)
})

test('unique property of blog is id and not _id', async ()=> {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    for(let i = 0; i < blogs.length; i++){
        const blog = blogs[i]
        assert.strictEqual('id' in blog, true)
    }
})

test('a new blog is added successfully', async () => {
    const newBlog = {
        title: "Unknown",
        author: "Unknown",
        url: "http://example.com/unknown.html",
        likes: 69
    }

    await api.post('/api/blogs')
                .send(newBlog).expect(201)
                .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, dummyBlogs.length + 1)
})

test('default likes to zero if likes property is missing', async ()=> {
    const newBlog = {
        title: "Unknown",
        author: "Unknown",
        url: "http://example.com/unknown.html",
    }

    const respone = await api.post('/api/blogs')
                .send(newBlog).expect(201)
                .expect('Content-Type', /application\/json/)

    assert.strictEqual(respone.body.likes, 0)
})

test('response is 400 if invalid data is sent', async ()=> {
    const newBlog = {
        author: "Unknown",
        url: "http://example.com/unknown.html",
    }

    const respone = await api.post('/api/blogs')
                .send(newBlog).expect(400)
})

test('delete a valid object', async () => {
    const newBlog = {
        title: "Unknown",
        author: "Unknown",
        url: "http://example.com/unknown.html",
    }

    const respone = await api.post('/api/blogs').send(newBlog)

    await api.delete(`/api/blogs/${respone.body.id}`).expect(204)
})

test('update the number of likes', async ()=> {
    const newBlog = {
        title: "Unknown",
        author: "Unknown",
        url: "http://example.com/unknown.html",
        likes: 34
    }

    const respone = await api.post('/api/blogs')
                .send(newBlog)
    
    const upatedResponse = 
    await api.put(`/api/blogs/${respone.body.id}`).send({...newBlog, likes: 69}).expect(201) 

    assert.strictEqual(upatedResponse.body.likes, 69)
})

after(async ()=>{
    await mongoose.connection.close()
})