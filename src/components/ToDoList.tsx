import React, { useState } from 'react';
import '../css/ToDoList.css';

interface Task {
    id: number;
    text: string;
    attendee?: string;
    completed: boolean;
}

const ToDoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>('');
    const [attendeeInputs, setAttendeeInputs] = useState<{ [id: number]: string }>({});
    const [editAttendee, setEditAttendee] = useState<{ [id: number]: boolean }>({});

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    text: newTask,
                    completed: false,
                },
            ]);
            setNewTask('');
        }
    };

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setAttendeeInputs(prev => {
            const { [taskId]: _, ...rest } = prev;
            return rest;
        });
        setEditAttendee(prev => {
            const { [taskId]: _, ...rest } = prev;
            return rest;
        });
    };

    const toggleTask = (taskId: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleAssignClick = (task: Task) => {
        if (!task.attendee || editAttendee[task.id]) {
            // Assign or re-assign
            setTasks(
                tasks.map((t) =>
                    t.id === task.id
                        ? { ...t, attendee: attendeeInputs[task.id] || '' }
                        : t
                )
            );
            setEditAttendee((prev) => ({ ...prev, [task.id]: false }));
            setAttendeeInputs((prev) => {
                const { [task.id]: _, ...rest } = prev;
                return rest;
            });
        } else {
            // Switch to edit mode, pre-fill with current attendee
            setEditAttendee((prev) => ({ ...prev, [task.id]: true }));
            setAttendeeInputs((prev) => ({ ...prev, [task.id]: task.attendee || '' }));
        }
    };

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />
                <button type="submit">Add Task</button>
            </form>
            <table className="todo-table">
                <thead>
                <tr>
                    <th>Task</th>
                    <th>Attendee</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className={task.completed ? "completed" : "incomplete"}>
                        <td className="task-col">
                            <p className={task.completed ? 'completed' : 'incomplete'}>{task.text}</p>
                        </td>
                        <td className="attendee-col">
                            {(!task.attendee || editAttendee[task.id]) ? (
                                <input
                                    type="text"
                                    value={attendeeInputs[task.id] || ''}
                                    placeholder="Assign attendee"
                                    style={{ width: "80%" }}
                                    onChange={(e) =>
                                        setAttendeeInputs({
                                            ...attendeeInputs,
                                            [task.id]: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <span>{task.attendee}</span>
                            )}
                        </td>
                        <td className="actions-col">
                            <button
                                className="assign"
                                type="button"
                                onClick={() => handleAssignClick(task)}
                            >
                                Assign
                            </button>
                            <button
                                className="toggle"
                                onClick={() => toggleTask(task.id)}
                                type="button"
                            >
                                Complete
                            </button>
                            <button
                                className="delete"
                                onClick={() => deleteTask(task.id)}
                                type="button"
                                style={{ background: "#dc3545", color: "white", marginTop: "6px" }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ToDoList;
