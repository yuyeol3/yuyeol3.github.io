import Post from "../Models/Post.js";


export async function getPosts() {
    const res = await fetch("/posts.json");
    const posts = await res.json();
    return posts;
}

export async function getPost(href) {

        const res = await fetch(href);

        if (!res.ok) {
            throw new Error(`HTTP error! status ${res.status}`);
        }

        const post = new Post(await res.text(), href.split("/"));
        return post;
}
