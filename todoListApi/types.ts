export interface User {
    username: string;
    password: string;
    token: string;
}

export interface Task {
    _id: string;
    user: string;
    title: string;
    description: string;
    status: string;
}