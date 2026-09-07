import React from 'react';

interface EasterEggModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            id="easterEggModal"
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="modal-card">
                <button
                    className="modal-close-btn"
                    id="closeModalBtn"
                    onClick={onClose}
                    aria-label="Close Modal"
                >
                    &times;
                </button>
                <div className="modal-royal-crest">👑</div>
                <h3 className="modal-title">A Royal Declaration</h3>
                <p className="modal-quote">
                    "In a universe of billions of stars, none shines with the timeless grace, elegance, and magic that Queen Jiyu brings into our world."
                </p>
                <div className="modal-signature">— Dedicated to Queen Jiyu —</div>
            </div>
        </div>
    );
};

