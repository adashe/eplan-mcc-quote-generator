import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";

function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            onClick={(e) => {
                e.preventDefault();
                navigate(-1);
            }}
        >
            &larr; Back
        </Button>
    );
}

export default BackButton;
