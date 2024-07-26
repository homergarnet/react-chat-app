import ClickableCard from '../components/card/ClickableCard';
import React from 'react'
import myImage from '../assets/systemimages/support.png';
import useStore from 'store';


const ConnectCsr = () => {

    const { loading, setLoading, data, error, fetchData } = useStore();

    const handleClick = () => {
        setLoading(true);
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <ClickableCard
                            title="Chat with Customer Service Representative"
                            text="You can connect with Customer Service Representative when you need help by clicking this dialog."
                            imageUrl={myImage}
                            onClick={handleClick}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConnectCsr
