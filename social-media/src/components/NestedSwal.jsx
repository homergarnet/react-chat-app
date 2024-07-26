import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const NestedSwal = () => {
    const handleFirstAlert = () => {
        Swal.fire({
            title: 'First Alert',
            text: 'This is the first alert',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Next',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                handleSecondAlert();
            }
        });
    };

    const handleSecondAlert = () => {
        Swal.fire({
            title: 'Second Alert',
            text: 'This is the second alert',
            icon: 'warning',
            confirmButtonText: 'OK',
        });
    };

    return (
        <div className="container mt-5">
            <button className="btn btn-primary" onClick={handleFirstAlert}>
                Open Nested Alert
            </button>
        </div>
    );
};

export default NestedSwal;