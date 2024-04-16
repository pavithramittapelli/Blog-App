import Post from "../components/Post";
import React, { useEffect, useState } from 'react';

function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:4000/post')
            .then(response => response.json())
            .then(posts => {
                setPosts(posts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    if (posts.length === 0) {
        return (
            <div>No Posts Yet</div>
        );
    }

    return (
        <>
            {posts.map(post => (
                <div key={post._id}>
                    <Post {...post} />
                </div>
            ))}
        </>
    );
}

export default IndexPage;
