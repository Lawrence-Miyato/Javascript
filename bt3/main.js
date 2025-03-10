const POSTS_URL = 'http://localhost:3000/posts' // URL API Posts
const AUTHORS_URL = 'http://localhost:3000/authors' // URL API Authors
var globalPosts
var globalAuthors

// Tải dữ liệu khi khởi động
LoadDataSync()

// Hàm để cập nhật dropdown dựa trên mảng authors
function updateDropdown() {
    const dropdown = document.getElementById('authorDropdown')
    dropdown.innerHTML = '' // Xóa tất cả các tùy chọn hiện tại

    // Thêm tùy chọn mặc định
    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = '-- Select Author --'
    dropdown.appendChild(defaultOption)

    // Duyệt qua mảng authors để thêm từng phần tử vào dropdown
    globalAuthors.forEach((author, index) => {
        const option = document.createElement('option')
        option.value = index + 1 // Đặt giá trị của tùy chọn
        option.textContent = author.name // Tên tác giả
        dropdown.appendChild(option)
    })
}


// Load data cho Posts và Authors
async function LoadDataSync() {
    try {
        // Fetch posts
        let resPosts = await fetch(POSTS_URL) // Fetch từ API Posts
        if (!resPosts.ok) throw new Error('Failed to fetch posts')
        let posts = await resPosts.json()
        posts = posts.filter(p => !p.isDelete) // Lọc những post chưa bị xóa
        globalPosts = posts

        // Fetch authors
        let resAuthors = await fetch(AUTHORS_URL) // Fetch từ API Authors
        if (!resAuthors.ok) throw new Error('Failed to fetch authors')
        let authors = await resAuthors.json()
        authors = authors.filter(a => !a.isDelete) // Lọc những author chưa bị xóa
        globalAuthors = authors

        // Hiển thị Posts
        let bodyPosts = document.getElementById("bodyPosts")
        if (bodyPosts) {
            bodyPosts.innerHTML = ""
            for (const post of posts) {
                bodyPosts.innerHTML += ConvertPostFromObjToHtml(post)
            }
        } else {
            console.error('Element with id "bodyPosts" not found.')
        }

        // Hiển thị Authors
        let bodyAuthors = document.getElementById("bodyAuthors")
        if (bodyAuthors) {
            bodyAuthors.innerHTML = ""
            for (const author of authors) {
                bodyAuthors.innerHTML += ConvertAuthorFromObjToHtml(author)
            }
        } else {
            console.error('Element with id "bodyAuthors" not found.')
        }
    } catch (error) {
        console.error('Error loading data:', error)
    }


    // Gọi hàm để hiển thị dropdown ban đầu
    updateDropdown()
}

// Convert Post từ Object sang HTML để hiển thị
function ConvertPostFromObjToHtml(post) {
    // Kiểm tra thông tin của post

    // Tìm tác giả theo authorId trong globalAuthors
    // let author = globalAuthors.find(a => a.id == post.authorId) // Sử dụng == để đảm bảo so sánh đúng dù khác kiểu
    let author = globalAuthors.find(a => a.name == post.author)
    let authorName = author ? author.name : "Unknown"

    // Kiểm tra thông tin author tìm được
    let string = '<tr>'
    string += `<td>${post.id}</td>`
    string += `<td>${post.title}</td>`
    string += `<td>${post.views}</td>`
    string += `<td>${authorName}</td>` // Hiển thị tên tác giả thay vì authorId
    string += `<td><button onclick="DeletePost(${post.id}, '${authorName}');return false;">Delete</button></td>`
    string += '</tr>'
    return string
}

// Convert Author từ Object sang HTML để hiển thị
function ConvertAuthorFromObjToHtml(author) {
    let string = '<tr>'
    string += `<td>${author.id}</td>`
    string += `<td>${author.name}</td>`
    string += `<td>${author.postCount || 0}</td>`
    string += `<td><button onclick="DeleteAuthor('${author.id}');return false;">Delete</button></td>`
    string += '</tr>'
    return string
}

// Kiểm tra sự tồn tại của Post ID
function checkExistPostID(id) {
    return globalPosts.some(post => post.id == id)
}

// Kiểm tra sự tồn tại của Author ID
function checkExistAuthorID(id) {
    return globalAuthors.some(author => author.id == id)
}

function getMaxPostID() {
    let ids = globalPosts.map(p => Number.parseInt(p.id))
    return Math.max(...ids)
}

function getMaxAuthorID() {
    let ids = globalAuthors.map(p => Number.parseInt(p.id))
    return Math.max(...ids)
}

function ClearForm(formName) {
    if (formName === 'post') {
        // Xóa giá trị của các trường trong form 'post'
        document.getElementById("id").value = ''
        document.getElementById("title").value = ''
        document.getElementById("views").value = ''
        document.getElementById("authorDropdown").value = '' // Xóa chọn tác giả
    }
}

// Lưu hoặc cập nhật Post
function SavePost() {
    let id = document.getElementById("id").value
    let title = document.getElementById("title").value
    let views = document.getElementById("views").value
    let authorId = document.getElementById("authorDropdown").value // Lấy ID của tác giả từ dropdown

    // Get author name by id
    let author = globalAuthors.find(a => a.id == authorId)
    if (!author) {
        console.error(`Cannot find author with id ${authorId}`)
    }

    // Tạo ID mới nếu không có
    if (!id || isNaN(id)) {
        id = (getMaxPostID(globalPosts) + 1).toString()
    }

    let obj = {
        id: id,
        title: title,
        views: views,
        author: author.name,  // Gán tác giả vào bài viết
        isDelete: false
    }

    // Lưu post cũ để kiểm tra tác giả trước khi update
    let existingPost = globalPosts.find(p => p.id == id)


    if (checkExistPostID(id, globalPosts)) {
        // Nếu bài viết đã tồn tại, cập nhật bài viết
        fetch(POSTS_URL + "/" + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(function () {
            LoadDataSync() // Tải lại dữ liệu sau khi cập nhật

            // Cập nhật post count nếu tác giả thay đổi
            if (existingPost && existingPost.authorId !== authorId) {
                UpdatePostCount(existingPost.authorId, -1) // Giảm post count của tác giả cũ
                UpdatePostCount(authorId, 1) // Tăng post count của tác giả mới
            }
        })
    } else {
        // Nếu bài viết chưa tồn tại, thêm mới
        fetch(POSTS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(function () {
            LoadDataSync() // Tải lại dữ liệu sau khi thêm mới

            // Tăng post count của tác giả mới
            UpdatePostCount(authorId, 1)
        })
    }
    ClearForm('post') // Xóa dữ liệu sau khi lưu
}

// Hàm cập nhật post count
/*
 * Cap nhat post count cua tac gia va update len db
 * authorId: id tac gia
 * count: so luong bai post, dau (-) la giam so luong post count bai post 
 * isAdd: true - bai post duoc them vao, false - bai post duoc xoa
 */
function UpdatePostCount(authorId, count) {
    let author = globalAuthors.find(a => a.id == authorId)
    if (author) {
        author.postCount = (author.postCount || 0) + count

        // Gửi PUT request để cập nhật postCount lên API
        fetch(AUTHORS_URL + "/" + authorId, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(author)
        }).then(function () {
        }).catch(function (error) {
            console.error(`Failed to update post count for author ${author.name}:`, error)
        })
    } else {
    }
}

// Lưu hoặc cập nhật Author
// Lưu tác giả
function SaveAuthor() {
    let id = document.getElementById("id").value
    let name = document.getElementById("name").value

    if (!id || isNaN(id)) {
        id = (getMaxAuthorID(globalAuthors) + 1).toString() // Tạo ID mới nếu không có
    }

    let obj = {
        id: id,
        name: name,
        postCount: 0,  // Tác giả mới có postCount = 0
        isDelete: false  // Đánh dấu tác giả chưa bị xóa
    }


    if (checkExistAuthorID(id, globalAuthors)) {
        // Nếu tác giả đã tồn tại, cập nhật tác giả
        fetch(AUTHORS_URL + "/" + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(function () {
            LoadDataSync() // Tải lại dữ liệu sau khi cập nhật
        })
    } else {
        // Nếu tác giả chưa tồn tại, thêm mới
        fetch(AUTHORS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(function () {
            LoadDataSync() // Tải lại dữ liệu sau khi thêm mới
        })
    }

    ClearForm('author') // Xóa dữ liệu sau khi lưu
}

// Xóa mềm Post
async function DeletePost(id, authorName) {
    let existingPost = globalPosts.find(p => p.id == id)

    // Fetch posts
    let resPosts = await fetch(POSTS_URL + "/" + id) // Fetch từ API Posts
    if (!resPosts.ok) throw new Error('Failed to fetch posts')
    let fetchedPosts = await resPosts.json()

    if (fetchedPosts.author != authorName) {
        throw new Error('Author mismatch or duplicated! Please check database!')
    }

    if (!existingPost) {
        console.error("Post not found")
        return
    }

    existingPost.isDelete = true // Đánh dấu Post là bị xóa

    let existingAuthor = globalAuthors.find(a => a.name == existingPost.author)
    let existingAuthorId = existingAuthor.id
    try {
        // Cập nhật trạng thái xóa mềm cho Post
        let res = await fetch(POSTS_URL + "/" + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(existingPost)
        })
        if (!res.ok) {
            throw new Error('Failed to delete post')
        }

        // Giảm postCount của tác giả
        UpdatePostCount(existingAuthorId, -1)
        // Tải lại dữ liệu sau khi xóa
        LoadDataSync()
    } catch (error) {
        console.error('Error deleting post:', error)
    }
}

// Xóa mềm Author
async function DeleteAuthor(id) {
    let author = globalAuthors.find(a => a.id == id)
    if (!author) {
        console.error("Author not found")
        return
    }

    author.isDelete = true // Đánh dấu Author là bị xóa

    try {
        // Cập nhật trạng thái xóa mềm cho Author
        let res = await fetch(AUTHORS_URL + "/" + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(author)
        })
        if (!res.ok) throw new Error('Failed to delete author')

        // Giam so luong post count cu tac gia
        UpdatePostCount()
        // Tải lại dữ liệu sau khi xóa
        LoadDataSync()
    } catch (error) {
        console.error('Error deleting author:', error)
    }
}
