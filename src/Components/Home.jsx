import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export default function Home() {
    const username = sessionStorage.username;

    return (
        <div>
            <h1>Welcome to the car dealer Veriku SRL</h1>
            <h2>Hello, {username}!</h2>
            <h2>Here you can buy cars, sell cars, and manage your car inventory.</h2>
            <h3>No scam at all!</h3>
            <h4 style={{ fontWeight: 'bold' }}>NO REFUNDS!</h4>
        </div>
    );
}
