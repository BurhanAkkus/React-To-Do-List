import React, {useEffect, useState} from 'react';
import '../css/ToDoList.css';

interface Task {
    id: number;
    text: string;
    attendee?: string;
    completed: boolean;
}
const DEFAULT_TASKS: Task[] = [
    { id: 1, text: "Filtre Ekle", completed: false, attendee: "Burhan" },
    { id: 2, text: "Ecof Uygulaması Yap", completed: false, attendee: "Burhan" },
    { id: 3, text: "Köylü Basmayı Öğren", completed: false, attendee: "Ozan" },
    { id: 4, text: "Makro Yönetmeyi Öğren", completed: false, attendee: "Teoman" },
    { id: 5, text: "Kolon Boylarını Sabitle", completed: false, attendee: "Burhan" }
];
const ToDoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
    const [taskFilter, setTaskFilter] = useState<Task>();
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

    const filterTasks = () =>{
        let tasksToFilter: Task[] = tasks

        if(taskFilter){
            if(taskFilter.text && taskFilter.text.length > 0)
            {
                tasksToFilter = tasksToFilter.filter(task => task.text.toLowerCase().includes(taskFilter.text.toLowerCase()))
            }
            if(taskFilter.attendee && taskFilter.attendee.length > 0){
                tasksToFilter = tasksToFilter.filter(task => task.attendee.toLowerCase().includes(taskFilter.attendee.toLowerCase()))
            }
        }
        setFilteredTasks(tasksToFilter)
    }

    useEffect(() =>{
        filterTasks()
    },[taskFilter])

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

            <form onSubmit={filterTasks}>
            <input
                type="text"
                value={taskFilter?.text || ''}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Task Name Filter"
            />
            <input
                type="text"
                value={taskFilter?.attendee || ''}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, attendee: e.target.value }))}
                placeholder="Attendee Filter"
            />

                <button type="submit">Filter Tasks</button>
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
                {filteredTasks.map((task) => (
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
