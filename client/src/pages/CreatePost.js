import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Editor from '../components/Editor';
function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false)
    async function createNewPost(e) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        e.preventDefault();

        const response = await fetch("http://127.0.0.1:4000/post", {
            method: 'POST',
            body: data,
            credentials: 'include'
        })
        if (response.ok) {
            response.json().then(postInfo => {
                setRedirect(true);
            })
        } else alert("Post not created");
    }
    if (redirect) {
        return <Navigate to='/' />
    }
    return (
        <form onSubmit={createNewPost} >
            <input type="text"
                placeholder={'Title'}
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <input type="text"
                placeholder={'Summary'}
                value={summary}
                onChange={ev => setSummary(ev.target.value)} />
            <input type="file"
                onChange={ev => setFiles(ev.target.files)} />
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: '10px' }}>Create Post</button>
        </form>
    )
}

export default CreatePost;
