import React from 'react';
import { formatISO9075 } from 'date-fns'; // corrected import statement
import { Link } from 'react-router-dom';

function Post({ _id, title, summary, createdAt, cover, author }) { // destructuring props object
    return (
        <div>
            <div className='post'>
                <div className="image">
                    <Link to={`/post/${_id}`} >
                        <img src={'http://127.0.0.1:4000/' + cover} alt="random_image" />
                    </Link>
                </div>
                <div className='texts'>
                    <Link to={`/post/${_id}`} >
                        <h2>{title}</h2>
                    </Link>
                    <p className='info'>
                        <a className='author'>{author.username}</a>
                        <time>{formatISO9075(new Date(createdAt))}</time>
                        {/* <time>{format(new Date(createdAt), 'MMM d,yyyy HH:mm')}</time> */}

                    </p>
                    <p className='summary'>{summary}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;
