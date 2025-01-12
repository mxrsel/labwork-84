export interface User {
    username: string;
    password: string;
    token: string;
}

export interface UserTask {
    user: string;
    title: string;
    description: string;
    status: string;
}

export type TaskWithoutUser = Omit<UserTask, 'user'>;