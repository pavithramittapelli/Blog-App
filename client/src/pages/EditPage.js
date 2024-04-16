import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Editor from '../components/Editor';

function EditPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [cover, setCover] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        console.log("Fetching post data for ID:", id);
        fetch(`http://127.0.0.1:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    console.log("Post data received:", postInfo);
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                    setCover(`http://127.0.0.1:4000/${postInfo.cover}`);
                    setFiles(postInfo.cover);
                    // Set the file if available (assuming files is an array)
                    if (postInfo.files && postInfo.files.length > 0) {
                        console.log("Setting files:", postInfo.files[0]);
                        setFiles(postInfo.files[0]);
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching post data:", error);
            });
    }, [id]);

    async function updatePost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        data.set('cover', cover);
        if (files?.[0])
            data.set('file', files[0]);
        if (cover)
            data.set('cover', cover);
        try {
            const response = await fetch(`http://127.0.0.1:4000/post/${id})`, {
                method: 'PUT',
                body: data,
                credentials: 'include',
            })
            if (response.ok) {
                console.log("put", response);
                setRedirect(true);
            }
        } catch (e) {
            alert("couldnt edit the post");
            setRedirect(true);
        }
    }
    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }
    return (
        <form onSubmit={updatePost} >
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
            <button style={{ marginTop: '10px' }}>Update Post</button>
        </form>
    )
}
export default EditPage;
