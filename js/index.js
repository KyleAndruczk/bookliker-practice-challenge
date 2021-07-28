const list = document.querySelector('div#list-panel')
const show = document.querySelector('div#show-panel')
let unliked = true

function createOneBook(book) {
    let ul = list.querySelector('ul#list')
    const li = document.createElement('li')
    li.classList.add('book')
    li.dataset.id = book.id

    li.textContent = book.title

    ul.append(li)

}

function renderAllBooks() {
    // articlesArray.forEach(function (articleObj) {
    //     createOneCard(articleObj)
    // })

    fetch('http://localhost:3000/books')
        .then(r => r.json())
        .then(books => {
            // console.log(data)
            books.forEach(book => {
                createOneBook(book)
            })
        })
}

function getOneBook(id) {
    return fetch(`http://localhost:3000/books/${id}`)
    .then(r => r.json())
}



list.addEventListener('click', event => {

    if (event.target.matches('li.book')) {
        console.log(event.target.dataset.id)
        show.innerHTML = ""
        let book = getOneBook(event.target.dataset.id)
        book.then(book => {
            const outerDiv = document.createElement('div')

            outerDiv.innerHTML = `
            <div class="img-container">
                <img src="${book.img_url}"
                    alt="${book.title}" />
                <div class="article-title-container">
                    <h4>${book.title}</h4>
                </div>
            </div>

            <p class='author'>${book.author}</p>
            <p class='description'>${book.description}</p>

            `
            show.append(outerDiv)
            console.log(book.users)
            const ul = document.createElement('ul')
            ul.classList.add('book-likers')
            ul.dataset.id = book.id
            book.users.forEach(user => {
                
                // let likesList = document.querySelector('ul#likes-list')
                // console.log(likesList)
                
                const li = document.createElement('li')

                li.classList.add('liker')
                li.dataset.id = user.id
                li.textContent = user.username
                ul.append(li)


            })
            show.append(ul)

            const btn = document.createElement('button')
            btn.classList.add('like-button')
            btn.textContent = "LIKE"

            show.append(btn)


        })
    }
})

show.addEventListener('click', event => {
    
    if (event.target.matches('button.like-button')) {

        let ul = show.querySelector('ul.book-likers')
        let book = getOneBook(ul.dataset.id)
        
        if (unliked) {
            const currUser = {
                'id': 1,
                'username': "pouros"
            }

            const li = document.createElement('li')
            li.classList.add('liker')
            li.dataset.id = currUser['id']
            li.textContent = currUser['username']

            ul.append(li)

            
            book.then(book => {
                let likers = book.users
                likers.push(currUser)

                fetch(`http://localhost:3000/books/${ul.dataset.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ users: likers })
                    })
                    .then(r => r.json())
                    .then(data => console.log(data))
                    unliked = false
                    event.target.textContent = "UNLIKE"
            })
            
        } else {

            ul.lastChild.remove()

            book.then(book => {
                let likers = book.users
                likers.pop()

                fetch(`http://localhost:3000/books/${ul.dataset.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ users: likers })
                    })
                    .then(r => r.json())
                    .then(data => console.log(data))
                    unliked = true
                    event.target.textContent = "LIKE"
            })
            
        }
        
    }
})







document.addEventListener("DOMContentLoaded", function() {

    renderAllBooks()
});


