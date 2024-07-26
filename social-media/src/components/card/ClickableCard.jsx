import React from 'react';
import './ClickableCard.css';

const ClickableCard = ({ title, text, imageUrl, onClick }) => {
    return (
        <div className="card card-clickable" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className='text-center'>
                {imageUrl && <img src={imageUrl} className="card-img-top" alt="Card image cap" style={{ width: '30%', height: '100px' }} />}
            </div>


            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{text}</p>
            </div>
        </div>
    );
}

export default ClickableCard;