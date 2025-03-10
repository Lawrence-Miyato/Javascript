const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.json()) // Thêm dòng này để phân tích cú pháp JSON

var post = [
    {
        "id": "cjnqbubjzikmdb0u",
        "MSSV": 81007546058,
        "name": "Nguyễn Văn A",
        "average_score": 5
    },
    {
        "id": "a1nbsqi0edtvhknb",
        "MSSV": 35263423247,
        "name": "Lawrence Eula",
        "average_score": 8
    },
    {
        "id": "iw43jd6kadum7nsd",
        "MSSV": 11888907690,
        "name": "Charlie",
        "average_score": 6
    },
]

app.get('/', (req, res) => {
    console.log(req.query);
    let newPost = post;
    if (req.query.title) {
        newPost = newPost.filter(p => p.title.includes(req.query.title))
    }
    if (req.query.view) {
        if (req.query.view.$gte) {
            newPost = newPost.filter(p => p.views >= req.query.view.$gte)
        }
        if (req.query.view.$lte) {
            newPost = newPost.filter(p => p.views <= req.query.view.$lte)
        }
    }
    res.send(newPost)
})

app.get('/post', (req, res) => {
    const activePosts = post.filter(p => !p.isDelete); // Bỏ qua các phần tử đã bị đánh dấu là đã xóa
    res.json(activePosts);
});

app.post('/', (req, res) => {
    let newPost = {
        id: GenID(16),
        MSSV: GenMSSV(11),
        name: req.body.name,
        average_score: req.body["average score"]
    };
    post.push(newPost);
    res.status(200).send(newPost);
});

app.get("/:id", (req, res) => {
    const id = req.params.id;
    const postItem = post.find(p => p.id === id);
    if (postItem) {
        res.json(postItem);
    } else {
        res.status(404).send('Post not found');
    }
});

app.put('/:id', (req, res) => {
    const id = req.params.id;
    const postItem = post.find(p => p.id === id);
    if (postItem) {
        postItem.name = req.body.name; // Cập nhật thuộc tính name
        postItem["average score"] = req.body["average score"]; // Cập nhật thuộc tính average score
        res.status(200).send(postItem);
    } else {
        res.status(404).send({ message: "ID không tồn tại" });
    }
});

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    const postItem = post.find(p => p.id === id);
    if (postItem) {
        postItem.isDelete = true; // Đánh dấu phần tử là đã xóa
        res.status(200).send(postItem);
    } else {
        res.status(404).send({ message: "ID không tồn tại" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function GenID(length) {
    let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "";
    for (let index = 0; index < length; index++) {
        let rd = Math.floor(Math.random() * source.length);
        result += source.charAt(rd);
    }
    return result;
}

function GenMSSV(length) {
    let source = "0123456789"
    let result = "";
    for (let index = 0; index < length; index++) {
        let rd = Math.floor(Math.random() * source.length);
        result += source.charAt(rd);
    }
    return result;
}