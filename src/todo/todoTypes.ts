export enum Status{
    Completed='completed',
    Pending='pending',
}

export interface ITodo{
    task:string,
    deadline:string,
    status:Status
}