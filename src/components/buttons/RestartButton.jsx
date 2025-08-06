import Button from "./Button.jsx";

function RestartButton() {
    return <Button onClick={() => window.location.reload()}>Restart</Button>;
}

export default RestartButton;
