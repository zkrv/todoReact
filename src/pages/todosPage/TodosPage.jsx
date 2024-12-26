import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./todosPage.css"

const App = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [users, setUsers] = useState([]);
    const [modalMessage, setModalMessage] = useState("");


    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8000/todos");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };


    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:8000/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const newUser = await response.json();
            setUsers([...users, newUser]);
            setModalMessage("Пользователь успешно создан");
            reset();
        } catch (error) {
            console.error(error);
        }
    };


    const deleteUser = async (id) => {
        try {
            await fetch(`http://localhost:8000/todos/${id}`, { method: "DELETE" });
            setUsers(users.filter((user) => user.id !== id));
            setModalMessage("Пользователь успешно удален");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">
            <header className="header">
                <h1>GEEKS PROJECT BY RZAKIROV1</h1>
            </header>

            <div className="form-section">
                <input
                    {...register("name", { required: true })}
                    placeholder="Name"
                    className={errors.name ? "input error" : "input"}
                />
                <input
                    {...register("email", { required: true })}
                    placeholder="Email"
                    className={errors.email ? "input error" : "input"}
                />
                <input
                    {...register("username", { required: true })}
                    placeholder="Username"
                    className={errors.username ? "input error" : "input"}
                />
                <button className="create-btn" onClick={handleSubmit(onSubmit)}>
                    CREATE
                </button>
            </div>

            <div className="user-list">
                <div className="user-list-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Username</div>
                    <div>Actions</div>
                </div>

                {users.length > 0 ? (
                    users.map((user) => (
                        <div className="user-item" key={user.id}>
                            <div>{user.name}</div>
                            <div>{user.email}</div>
                            <div>{user.username}</div>
                            <div>
                                <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                                    delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-list">Список пуст</div>
                )}
            </div>

            {modalMessage && (
                <div className="modal">
                    <div className="modal-content">
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalMessage("")}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
